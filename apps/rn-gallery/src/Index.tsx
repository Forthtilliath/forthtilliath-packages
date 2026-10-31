import { DEMOS } from "./demos";

/** Without `?demo=`: links to every demo. */
export function Index() {
  return (
    <ul>
      {Object.keys(DEMOS).map((id) => (
        <li key={id}>
          <a href={`?demo=${id}`}>{id}</a>
        </li>
      ))}
    </ul>
  );
}
