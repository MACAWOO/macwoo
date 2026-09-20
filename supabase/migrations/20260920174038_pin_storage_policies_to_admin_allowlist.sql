-- Same change for the Website_images bucket: media writes were open to any
-- authenticated user. Public read stays open (the bucket serves the site).

drop policy if exists "Authenticated Insert t0i9x8_0" on storage.objects;
create policy "Admin insert Website_images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'Website_images' and public.is_admin());

drop policy if exists "Authenticated update Website_images" on storage.objects;
create policy "Admin update Website_images" on storage.objects
  for update to authenticated
  using (bucket_id = 'Website_images' and public.is_admin())
  with check (bucket_id = 'Website_images' and public.is_admin());

drop policy if exists "Authenticated delete t0i9x8_0" on storage.objects;
create policy "Admin delete Website_images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'Website_images' and public.is_admin());
