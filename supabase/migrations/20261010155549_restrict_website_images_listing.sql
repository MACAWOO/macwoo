-- Website_images is a public bucket: objects are served from
-- /storage/v1/object/public/... without consulting RLS at all. The
-- "Public read Website_images" SELECT policy therefore granted nothing the site
-- needs, but it did let anyone with the anon key enumerate every object in the
-- bucket via storage.list() — including uploads not yet linked from any page.
-- Listing is only used by the admin MediaPicker, so pin it to the allowlist.

drop policy if exists "Public read Website_images" on storage.objects;
create policy "Admin read Website_images" on storage.objects
  for select to authenticated
  using (bucket_id = 'Website_images' and private.is_admin());

-- Mirror the server-side upload rules (server/api/media/upload.post.ts) at the
-- bucket level, so even a direct Storage API write by an admin session can't
-- store HTML/SVG or oversized files. Existing objects are unaffected.
update storage.buckets
set
  allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/webm', 'video/ogg'
  ],
  file_size_limit = 20 * 1024 * 1024
where id = 'Website_images';
