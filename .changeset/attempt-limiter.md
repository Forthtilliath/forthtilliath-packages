---
"@forthtilliath/ts-kit": minor
---

New `createAttemptLimiter` (`security/`): growing delays between attempts at a secret such as a PIN (4 free failures, then 30 s, 1 min, 5 min, 15 min), with the counter kept in an injected storage (e.g. expo-secure-store). An unreadable or tampered counter counts as used up, a clock set back restarts the delay from now, and parallel attempts can't lose a failure.
