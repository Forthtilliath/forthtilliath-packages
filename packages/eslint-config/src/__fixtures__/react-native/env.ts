declare const process: { env: Record<string, string | undefined> };

// Both stay `undefined` in an Expo bundle: only a literal
// `process.env.EXPO_PUBLIC_X` access is inlined at build time.
const { EXPO_PUBLIC_API_URL } = process.env;
const key = "EXPO_PUBLIC_SENTRY_DSN";

export const apiUrl = EXPO_PUBLIC_API_URL;
export const sentryDsn = process.env[key];
