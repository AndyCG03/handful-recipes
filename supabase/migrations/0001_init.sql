-- Applied to project handful-recipes (Mezia). Clients never touch this table: the app API
-- uses the server-only secret key, so RLS is on with no policies by design.
create table public.recipes (
  id uuid primary key,
  ask_token text not null unique,
  status text not null,
  doc jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index recipes_status_idx on public.recipes (status);
alter table public.recipes enable row level security;
revoke all on public.recipes from anon, authenticated;

-- recipes_owner: every recipe belongs to a Supabase Auth user.
alter table public.recipes add column owner_id uuid not null references auth.users(id) on delete cascade;
create index recipes_owner_created_idx on public.recipes (owner_id, created_at desc);
