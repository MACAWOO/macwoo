# Supabase migrations

The 13 migrations created before 2026-09-20 were applied directly against the
hosted project and exist only in its remote migration history — they were never
mirrored here. The files in this directory start from the 2026-09-20 security
pass so that those changes, which alter the authorization model, are reviewable
and reversible from the repo.

Run `supabase migration list` to compare local files against the remote history.
