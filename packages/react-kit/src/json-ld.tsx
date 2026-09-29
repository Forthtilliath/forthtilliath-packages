export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Serializes `data` for inlining in a `<script>` tag: `<` is escaped as its
 * JSON unicode sequence, so a value containing `</script>` (or `<!--`) can't
 * close the tag early and inject HTML. The result parses back to the same data.
 */
function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Injects a JSON-LD `<script>` block. String values are escaped so they can't
 * break out of the tag, but `data` should still be built server-side, since it
 * is serialized via `dangerouslySetInnerHTML`.
 *
 * @example
 * <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: "Acme" }} />
 *
 * @param {JsonLdProps} props
 * @returns {React.ReactNode}
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Escaped by serializeJsonLd so no value can close the <script> tag.
      // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
