-- contact_submissions accepts anonymous INSERTs so the public contact form can
-- write to it, but the anon key ships in the page bundle: anyone can POST to
-- /rest/v1/contact_submissions directly, skipping Turnstile and the server-side
-- length checks, and could pick their own `status` / `submitted_at`.
--
-- Bound what an anonymous insert can contain. The limits mirror
-- server/api/contact.post.ts. Once SUPABASE_SERVICE_ROLE_KEY is configured for
-- the Pages project the server no longer needs this policy and it can be
-- dropped entirely (see the note at the bottom).

alter table public.contact_submissions
  add constraint contact_submissions_name_len check (char_length(name) between 1 and 200),
  add constraint contact_submissions_email_len check (char_length(email) between 3 and 320),
  add constraint contact_submissions_phone_len check (phone is null or char_length(phone) <= 50),
  add constraint contact_submissions_service_len check (service is null or char_length(service) <= 100),
  add constraint contact_submissions_message_len check (char_length(message) between 1 and 5000);

-- New submissions always arrive as 'new' with a server-assigned timestamp;
-- only admins (via the "Admin update" policy) change status afterwards.
drop policy if exists "Anon insert" on public.contact_submissions;
create policy "Anon insert" on public.contact_submissions
  for insert to anon, authenticated
  with check (
    coalesce(status, 'new') = 'new'
    and submitted_at between now() - interval '1 minute' and now() + interval '1 minute'
  );

-- Follow-up once the service-role key is live in production:
--   drop policy "Anon insert" on public.contact_submissions;
