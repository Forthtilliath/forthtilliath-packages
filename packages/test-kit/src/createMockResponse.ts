export interface MockResponseOptions {
  /** HTTP status code. Defaults to 200. */
  status?: number;
  /** Whether the response is considered successful. Defaults to `status < 400`. */
  ok?: boolean;
  /** Response headers. */
  headers?: Record<string, string>;
}

export interface MockResponse {
  ok: boolean;
  status: number;
  headers: Headers;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}

/**
 * Builds a `fetch()` `Response`-shaped object resolving `body` as JSON —
 * this repo's test files kept rebuilding the same `{ ok, status, json: () =>
 * Promise.resolve(body) }` object by hand for every `fetch` mock. Wrap it in
 * your test runner's own mock function to install it:
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
): MockResponse {
  const { status = 200, ok = status < 400, headers = {} } = options;
  return {
    ok,
    status,
    headers: new Headers(headers),
    json: () => Promise.resolve(body),
    text: () =>
      Promise.resolve(typeof body === "string" ? body : JSON.stringify(body)),
  };
}
