/** Options of {@link verifyBearerToken}. */
export interface VerifyBearerTokenOptions {
  /**
   * Shorter secrets are treated as missing, so a placeholder or a typo in
   * the environment never opens the route. Defaults to `16`.
   */
  minSecretLength?: number;
}

const BEARER = /^Bearer[ \t]+(\S+)[ \t]*$/i;

/**
 * Compares two strings in a time that doesn't depend on where they first
 * differ (only on the expected length), so the secret can't be guessed
 * character by character from response times.
 */
function constantTimeEqual(given: string, expected: string): boolean {
  let diff = given.length ^ expected.length;
  for (let i = 0; i < expected.length; i++) {
    const char = i < given.length ? given.charCodeAt(i) : 0;
    diff |= char ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Checks an `Authorization: Bearer <token>` header against a shared secret
 * (a cron job, a webhook, a machine-to-machine route).
 *
 * **Fails closed**: a missing, empty or too short secret rejects every
 * request. The usual `header !== \`Bearer ${process.env.SECRET}\`` lets in
 * anyone sending `Bearer undefined` as soon as the variable is missing.
 * The comparison runs in constant time.
 *
 * @param authorization - The request's `Authorization` header (`null` when absent).
 * @param secret - The expected token, usually `process.env.CRON_SECRET`.
 * @param options - See {@link VerifyBearerTokenOptions}.
 * @returns `true` only when the header carries exactly `secret`.
 * @example
 * export function GET(request: Request) {
 *   if (!verifyBearerToken(request.headers.get("authorization"), process.env.CRON_SECRET)) {
 *     return Response.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 *   // …
 * }
 */
export function verifyBearerToken(
  authorization: string | null | undefined,
  secret: string | null | undefined,
  { minSecretLength = 16 }: VerifyBearerTokenOptions = {},
): boolean {
  if (!secret || secret.length < Math.max(1, minSecretLength)) return false;
  if (!authorization) return false;

  const token = BEARER.exec(authorization)?.[1];
  if (!token) return false;
  return constantTimeEqual(token, secret);
}
