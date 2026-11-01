/** Options of {@link isAllowedUrl}. */
export interface IsAllowedUrlOptions {
  /**
   * Allowed host names, lower-case. A host also allows its subdomains:
   * `"example.com"` accepts `cdn.example.com`, never `evilexample.com`.
   */
  hosts: readonly string[];
  /** Allowed protocols, with the colon. Defaults to `["https:"]`. */
  protocols?: readonly string[];
}

/**
 * Checks that a URL points to an allowed host before a server fetches it
 * (an `og:image`, a webhook, a URL typed by a user…), so it can't be used to
 * reach an internal address (SSRF). URLs carrying credentials
 * (`https://user:pass@host`) and unparsable values are rejected.
 *
 * Check the final URL too after redirects (`response.url`): an allowed host
 * may redirect elsewhere. DNS isn't resolved, so only list hosts you trust.
 *
 * @param url - The URL to check.
 * @param options - See {@link IsAllowedUrlOptions}.
 * @returns `true` when the URL may be fetched.
 * @example
 * const hosts = ["scan-manga.com", "raw.githubusercontent.com"];
 * isAllowedUrl("https://static.scan-manga.com/cover.jpg", { hosts }); // => true
 * isAllowedUrl("http://169.254.169.254/latest", { hosts }); // => false
 */
export function isAllowedUrl(
  url: string | URL,
  { hosts, protocols = ["https:"] }: IsAllowedUrlOptions,
): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (!protocols.includes(parsed.protocol)) return false;
  if (parsed.username || parsed.password) return false;

  const { hostname } = parsed;
  return hosts.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  );
}
