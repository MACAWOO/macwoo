-- Pin the trigger function's search_path so name resolution can't be influenced
-- by the caller's schema search order. Flagged by the Supabase database linter
-- (0011_function_search_path_mutable). The body only calls now(), which lives in
-- pg_catalog and is always resolvable.
alter function public.set_updated_at() set search_path = '';
