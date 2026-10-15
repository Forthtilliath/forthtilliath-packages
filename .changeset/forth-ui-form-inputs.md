---
"@forthtilliath/forth-ui": patch
---

`NumberInput` no longer clamps on every keystroke (typing `600` with `min={128}` used to jump to `128` on the first digit): in-range values are reported as you type and the value is clamped on blur or Enter. Decimal steps accept a comma and no longer leak float noise (`0.4 + 0.01` → `0.41`). `ColorPicker`'s hex field now shows the controlled `value` instead of `#000000`, and follows it when it changes from outside.
