-- Guard for public functions meant for the service role only (admin routes,
-- scheduled jobs): call it first thing in the function body.
--
--   CREATE FUNCTION purge_old_logs() RETURNS void LANGUAGE plpgsql AS $$
--   BEGIN
--     PERFORM assert_service_role();
--     ...
--   END;
--   $$;
--
-- Why not `REVOKE EXECUTE ... FROM anon, authenticated`: on the Supabase
-- Postgres image 17.6.1.111, a denied EXECUTE crashes the server (segfault) —
-- a single anonymous request to /rest/v1/rpc/<function> restarted the whole
-- database. Leave the function executable and check the caller inside it: the
-- raised exception is harmless.
CREATE OR REPLACE FUNCTION assert_service_role()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_user NOT IN ('service_role', 'postgres') THEN
    RAISE EXCEPTION 'Reserved for the service role' USING ERRCODE = '42501';
  END IF;
END;
$$;
