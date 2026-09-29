---
"@forthtilliath/react-kit": patch
---

`JsonLd`: escape `<` in the serialized data, so a value containing `</script>` can no longer close the tag and inject HTML.
