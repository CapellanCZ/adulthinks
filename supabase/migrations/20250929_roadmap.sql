-- Create roadmap table optimized for querying
create table if not exists public.roadmap (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  task text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: reference auth.users (keep nullable FK if using auth schema)
-- alter table public.roadmap add constraint roadmap_user_fk foreign key (user_id) references auth.users(id) on delete cascade;

-- Indexes for performance
create index if not exists idx_roadmap_user on public.roadmap(user_id);
create index if not exists idx_roadmap_completed_user on public.roadmap(completed, user_id);
create index if not exists idx_roadmap_created_at_user on public.roadmap(created_at desc, user_id);

-- Trigger to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger roadmap_set_updated_at
before update on public.roadmap
for each row execute function public.set_updated_at();

-- Enable realtime for the table (if not already enabled globally)
-- Note: Supabase Realtime listens to Postgres changes; ensure Realtime is enabled for public schema in project settings.

-- (Optional) Row Level Security (RLS)
-- alter table public.roadmap enable row level security;
-- create policy "roadmap_select_own" on public.roadmap for select using (user_id = auth.uid());
-- create policy "roadmap_modify_own" on public.roadmap for insert with check (user_id = auth.uid());
-- create policy "roadmap_update_own" on public.roadmap for update using (user_id = auth.uid());
-- create policy "roadmap_delete_own" on public.roadmap for delete using (user_id = auth.uid());