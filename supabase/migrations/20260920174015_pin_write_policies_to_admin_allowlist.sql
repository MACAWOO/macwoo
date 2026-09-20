-- Replace the `auth.role() = 'authenticated'` write policies with the explicit
-- admin allowlist. Public read policies are unchanged.

drop policy if exists "Auth write" on public.blog_posts;
create policy "Admin write" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Auth write" on public.careers;
create policy "Admin write" on public.careers
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Auth write" on public.case_studies;
create policy "Admin write" on public.case_studies
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Auth write" on public.categories;
create policy "Admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Auth write" on public.client_logos;
create policy "Admin write" on public.client_logos
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Auth write" on public.page_settings;
create policy "Admin write" on public.page_settings
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Auth write" on public.portfolio_projects;
create policy "Admin write" on public.portfolio_projects
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Auth write" on public.site_media;
create policy "Admin write" on public.site_media
  for all using (public.is_admin()) with check (public.is_admin());

-- contact_submissions holds lead PII (name, email, phone, message). Anonymous
-- insert stays open -- that is the public contact form -- but reading and
-- triaging is admin-only.
drop policy if exists "Auth read" on public.contact_submissions;
create policy "Admin read" on public.contact_submissions
  for select using (public.is_admin());

drop policy if exists "Auth update" on public.contact_submissions;
create policy "Admin update" on public.contact_submissions
  for update using (public.is_admin()) with check (public.is_admin());
