// Docs "Show code" helpers. The dynamic source serializes the rendered JSX,
// but a component passed as a prop (an icon, `as={Image}`…) comes out as
// React's internal object — `{{ $$typeof: Symbol(react.forward_ref), … }}`.

const COMPONENT_OBJECT_PROP =
  /\{\{\s*\$\$typeof: Symbol\(react\.[a-z_]+\)[\s\S]*?\}\s*\}\}/g;

/**
 * Replaces each component object passed as a prop with `{name}` — `name`
 * being the component's name when the story knows it, `Component` otherwise.
 */
export function nameComponentProps(code: string, name = "Component"): string {
  return code.replace(COMPONENT_OBJECT_PROP, `{${name}}`);
}
