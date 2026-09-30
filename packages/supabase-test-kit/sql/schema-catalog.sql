-- Fingerprint of the public schema: what decides who can read or write what.
-- One row per element (kind, name, definition), sorted, to compare two databases:
-- the local one built by the migrations (snapshot test) and production (drift
-- check). Read-only.
SELECT kind, name, definition FROM (
  -- Tables: RLS enabled / forced
  SELECT 'table' AS kind, c.relname AS name,
         'rls=' || c.relrowsecurity || ' force=' || c.relforcerowsecurity AS definition
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')

  UNION ALL
  -- Columns: type and nullability (default values are ignored)
  SELECT 'column', c.relname || '.' || a.attname,
         format_type(a.atttypid, a.atttypmod) || CASE WHEN a.attnotnull THEN ' not null' ELSE '' END
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p') AND a.attnum > 0 AND NOT a.attisdropped

  UNION ALL
  -- Access policies (RLS)
  SELECT 'policy', tablename || '.' || policyname,
         cmd || ' ' || permissive || ' to ' || array_to_string(ARRAY(SELECT unnest(roles) ORDER BY 1), ',')
         || ' using (' || coalesce(qual, '') || ') check (' || coalesce(with_check, '') || ')'
  FROM pg_policies
  WHERE schemaname = 'public'

  UNION ALL
  -- Triggers (except the internal foreign key ones)
  SELECT 'trigger', c.relname || '.' || t.tgname,
         pg_get_triggerdef(t.oid) || ' enabled=' || t.tgenabled::text
  FROM pg_trigger t
  JOIN pg_class c ON c.oid = t.tgrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND NOT t.tgisinternal

  UNION ALL
  -- Functions (except extensions'): body hash (line endings normalized) and options
  SELECT 'function', p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')',
         'md5=' || md5(btrim(replace(p.prosrc, chr(13), ''), E' \n'))
         || ' security_definer=' || p.prosecdef
         || ' volatility=' || p.provolatile::text
         || ' config=' || coalesce(array_to_string(p.proconfig, ','), '')
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid = p.oid AND d.deptype = 'e')

  UNION ALL
  -- Constraints: foreign keys (ON DELETE…), unique, check, primary keys
  SELECT 'constraint', c.relname || '.' || co.conname, pg_get_constraintdef(co.oid)
  FROM pg_constraint co
  JOIN pg_class c ON c.oid = co.conrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND co.contype IN ('f', 'u', 'c', 'p')
) catalog
ORDER BY kind, name;
