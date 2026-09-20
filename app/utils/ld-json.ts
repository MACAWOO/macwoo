/**
 * Serialise a value for embedding in a `<script type="application/ld+json">`
 * block.
 *
 * `JSON.stringify` leaves `<`, `>` and `&` untouched, so CMS-authored text
 * containing `</script>` would close the block early and let anything after it
 * run as script. Escaping those three characters as `\uXXXX` keeps the payload
 * valid JSON (and identical once parsed) while making an early exit
 * impossible.
 */
export function ldJson(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026')
}
