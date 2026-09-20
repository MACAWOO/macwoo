-- PostgREST only exposes `public`, so leaving the allowlist table and its
-- helper there put both on the REST surface (`/rest/v1/rpc/is_admin`) and
-- tripped three database-linter warnings. Neither is meant to be reachable
-- from the API -- they exist purely for RLS policy evaluation.
--
-- Existing policies follow the function automatically: Postgres stores the
-- dependency, so `public.is_admin()` in every policy becomes
-- `private.is_admin()` without touching the policies themselves.

create schema if not exists private;

grant usage on schema private to anon, authenticated;

alter table public.admin_users set schema private;
alter function public.is_admin() set schema private;

revoke all on table private.admin_users from anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;
