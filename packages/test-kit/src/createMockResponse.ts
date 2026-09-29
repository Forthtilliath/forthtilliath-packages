export interface MockResponseOptions {
  /** HTTP status code (200–599). Defaults to 200. */
  status?: number;
  /**
   * Forces `response.ok`, whatever the status. Defaults to the real
   * `Response` rule: `true` for a 2xx status only.
   */
  ok?: boolean;
  /** Response headers. */
  headers?: Record<string, string>;
}

/** @deprecated `createMockResponse` now returns a real `Response`: use `Response`. */
export type MockResponse = Response;

// Statuses the Fetch spec forbids a body for (the constructor throws).
const NULL_BODY_STATUSES = new Set([101, 204, 205, 304]);

/**
 * Builds a real `fetch()` `Response` resolving `body` — so a mocked `fetch`
 * returns something with the full API (`clone()`, `blob()`, `arrayBuffer()`,
 * `headers`…), assignable wherever a `Response` is expected. Wrap it in your
 * test runner's own mock function to install it.
 *
 * A string `body` is sent as-is (`text()` returns it, `json()` parses it);
 * anything else is JSON-serialized, with a `content-type: application/json`
 * header unless one is given.
 *
 * @example
 * vi.stubGlobal(
 *   "fetch",
 *   vi.fn().mockResolvedValue(createMockResponse({ id: 1 })),
 * );
 * // or, for an error case:
 * vi.fn().mockResolvedValue(createMockResponse({}, { status: 404 }));
 */
export function createMockResponse(
  body: unknown,
  options: MockResponseOptions = {},
): Response {
  const { status = 200, ok, headers = {} } = options;
  const isText = typeof body === "string";
  const responseHeaders = new Headers(headers);
  if (!isText && !responseHeaders.has("content-type")) {
    responseHeaders.set("content-type", "application/json");
  }

  const response = new Response(
    NULL_BODY_STATUSES.has(status)
      ? null
      : isText
        ? body
        : JSON.stringify(body),
    { status, headers: responseHeaders },
  );
  if (ok !== undefined) {
    // `ok` is a prototype getter derived from `status`: shadow it on this
    // instance to honor an explicit override.
    Object.defineProperty(response, "ok", { value: ok });
  }
  return response;
}
