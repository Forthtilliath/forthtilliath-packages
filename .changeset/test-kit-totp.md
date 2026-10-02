---
"@forthtilliath/supabase-test-kit": minor
---

New `totpCode(secret, now?)`: the current 6-digit TOTP code of a base32 secret (RFC 6238, no dependency), to sign in MFA test accounts from tests, Playwright setups or scripts. New `clients.signInWithTotp(credentials)`: signs in, then enrolls and verifies a TOTP factor on the spot, for a full MFA session (`aal2`).
