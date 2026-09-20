-- Explicit admin allowlist.
--
-- Previously every RLS write policy read `auth.role() = 'authenticated'`, i.e.
-- "anyone holding any valid login for this project". That was only safe because
-- signup happens to be disabled; enabling email signup or anonymous sign-ins
-- would have handed every stranger full CMS write access and read access to the
-- contact_submissions leads table. Membership is now explicit.
--
-- NOTE: a later migration moves both objects into the `private` schema.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

insert into public.admin_users (user_id)
select id from auth.users
on conflict (user_id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
