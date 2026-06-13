# Security Evaluation — Macawoo

**Date:** 2026-06-12
**Scope:** Nuxt 3 site (`app/`), Supabase integration, admin panel, config.
**Method:** Static review of working tree (tracked + untracked changes).

---

## Summary

| Severity | Count | Issues |
|----------|-------|--------|
| Critical | 2 | Unauthenticated admin panel; client-side Supabase storage write/delete |
| High | 2 | Supabase key in client bundle; unrestricted file upload to public bucket |
| Medium | 3 | Dev server host exposure; client-only authorization on destructive ops; raw error message leakage |
| Low / Info | 3 | localStorage as datastore; silent dummy client; `v-html` usage (currently static) |

The core problem: **there is no authentication or server layer anywhere in the app.** No `app/middleware/`, no `server/` directory, no `definePageMeta` guard on `/admin`. All trust lives in the browser. Every "admin" capability is reachable by any visitor.

---

## CRITICAL

### C1 — Admin panel has no authentication
**File:** `app/pages/admin/index.vue`

Route `/admin` renders a full Django-style CRUD console (blog, portfolio, case studies, careers, page settings, categories, media). There is:
- no auth middleware (`app/middleware/` does not exist),
- no `definePageMeta({ middleware: ... })`,
- no login check — `Welcome, administrator` (line 726) is hardcoded cosmetic text.

Anyone who navigates to `/admin` gets full create / edit / delete / bulk-delete / reset, including the Supabase Media Library. The `confirm()`/`alert()` dialogs (lines 460, 488) are UX, not security.

**Impact:** Total content takeover + media destruction by any anonymous visitor.
**Fix:** Add server-side auth (Supabase Auth / session) and a route middleware that redirects unauthenticated users. Gate destructive operations behind a server endpoint that verifies the session — not just the client.

### C2 — Client-side write & delete against Supabase Storage
**Files:** `app/components/MediaPicker.vue`, `app/composables/useSupabase.ts`

`uploadFile` (line 108) and `deleteFile` (line 176) call `supabase.storage.from('Website_images').upload(...)` / `.remove(...)` directly from the browser using the public client. For this to work without a logged-in user, the bucket's RLS / storage policies must permit anonymous `INSERT`/`DELETE`. That means **anyone on the internet can upload or permanently delete any object in the bucket** via the same calls (or a crafted script — they don't even need the UI).

**Impact:** Anonymous file deletion (data loss) and anonymous upload (see H2).
**Fix:** Lock bucket storage policies to authenticated/role-restricted access. Route uploads/deletes through a server endpoint that authorizes the caller. Never expose write/delete to the anon role.

---

## HIGH

### H1 — Supabase key shipped in client bundle
**Files:** `nuxt.config.ts` (lines 21-26), `app/composables/useSupabase.ts` (lines 9-10)

`supabaseKey` is placed under `runtimeConfig.public`, so it is embedded in the client JS and visible to every visitor.

- If this is the **anon/publishable** key → expected to be public, **but only safe when RLS is enforced on every table and bucket.** Given C1/C2, RLS is the sole remaining control and must be audited.
- If this is the **service_role key** → catastrophic: full DB + storage bypass of RLS, leaked to every browser. **Verify immediately.**

**Fix:** Confirm the key is the anon key, not service_role. Audit RLS on all tables and the `Website_images` bucket. Move any privileged operations server-side with the service key kept in non-public `runtimeConfig`.

### H2 — Unrestricted file upload to a public bucket
**File:** `app/components/MediaPicker.vue` (lines 108-155, 286-291)

- The `accept="image/*,video/*"` attribute (line 289) is a client-side hint only — trivially bypassed.
- No MIME/extension/size validation occurs before `upload()`. Filename is sanitized (line 116) but **content is not.**
- Files land in a public bucket and get a permanent public URL (`getPublicUrl`, line 137).

**Impact:** The bucket becomes an open file host — malware distribution, phishing pages, oversized files (storage cost / DoS), and HTML/SVG served from your domain's CDN. Combined with C2, attackers can upload at will.
**Fix:** Validate type and size server-side; restrict allowed MIME types; cap file size; consider a private bucket with signed URLs; scan or content-type-pin uploads.

---

## MEDIUM

### M1 — Dev server bound to all interfaces with host check disabled
**File:** `nuxt.config.ts` (lines 32-34, 44-48)

`devServer.host: '0.0.0.0'` exposes the dev server on the LAN, and `vite.server.allowedHosts: true` disables Host-header validation, enabling DNS-rebinding against the dev server. Because the admin panel is unauthenticated (C1), anyone on the same network can reach `/admin` during development.

**Fix:** Bind to `localhost` by default, or scope `allowedHosts` to an explicit list. Don't disable the host check globally.

### M2 — Destructive actions authorized only on the client
**File:** `app/pages/admin/index.vue` (lines 458-522), `MediaPicker.vue` (line 176)

Delete / bulk-delete / reset rely entirely on in-browser logic and `confirm()`. There is no server-side authorization, so the protection is removable by anyone with dev tools.
**Fix:** Same as C1 — enforce authorization server-side; the client dialog is not a control.

### M3 — Raw backend error messages surfaced to UI
**File:** `app/components/MediaPicker.vue` (lines 82, 148, 189)

`err.message` from Supabase is shown directly (`errorMessage.value = err.message`, `alert(err.message)`). Can leak bucket structure, policy hints, or internal detail.
**Fix:** Show a generic message; log details only to the console/server.

---

## LOW / INFORMATIONAL

### L1 — localStorage used as the datastore
**Files:** `app/composables/useCategories.ts`, other `useBlogs/usePortfolio/...` composables

Content state persists in `localStorage` (e.g. `macwoo_categories`). Not a direct vuln, but data is fully client-controlled — no integrity, no trust boundary. `JSON.parse` is wrapped in try/catch (good). Treat any such data as untrusted if it later reaches a server.

### L2 — Dummy Supabase client silently swallows everything
**File:** `app/composables/useSupabase.ts` (lines 26-37)

The `Proxy`-based fallback returns itself for any access and never throws. Misconfiguration (missing URL/key) degrades silently, which can mask security-relevant failures (e.g. auth not wired). Prefer failing loudly outside production.

### L3 — `v-html` sink (currently static, keep it that way)
**File:** `app/components/PageHero.vue` (line 110), bound from `*/index.vue` `title-html="..."`

`titleHtml` is rendered with `v-html`. Today all bindings are hardcoded developer strings → no XSS. **Risk if** any future change pipes user/admin-editable content (blog/portfolio fields) into this prop. Keep `v-html` fed only by trusted constants; sanitize otherwise.

---

## Priority remediation order

1. **C1** — Add auth + route middleware on `/admin`.
2. **H1/C2** — Confirm key type; audit & tighten RLS on tables and the `Website_images` bucket; move writes/deletes server-side.
3. **H2** — Server-side upload validation (type/size); consider private bucket + signed URLs.
4. **M1** — Tighten dev server host/allowedHosts.
5. **M2/M3/L***— Server-side authz on mutations; sanitize error output; keep `v-html` static.
