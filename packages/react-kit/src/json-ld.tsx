export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Injects a JSON-LD `<script>` block. `data` must be built server-side, never
 * from user input, since it is serialized via `dangerouslySetInnerHTML`.
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
      // `data` is built server-side by the caller, never from user input —
      // same trust boundary as ChartStyle's dangerouslySetInnerHTML elsewhere in this repo.
      // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
