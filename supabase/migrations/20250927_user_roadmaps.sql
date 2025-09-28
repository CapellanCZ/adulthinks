-- Create table to store user-specific AI-generated roadmaps
create extension if not exists "pgcrypto";

create table if not exists public.user_roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  course text not null,
  milestones jsonb not null,
  progress jsonb not null default jsonb_build_object(
    'total_tasks', 0,
    'completed_tasks', 0,
    'progress_pct', 0,
    'current_milestone_index', 0
  ),
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_user_roadmaps_user_id on public.user_roadmaps(user_id);
create index if not exists idx_user_roadmaps_completed on public.user_roadmaps(is_completed);

-- Enable RLS and policies
alter table public.user_roadmaps enable row level security;

-- Allow authenticated users to manage their own roadmaps
create policy if not exists "user_roadmaps_select_own"
  on public.user_roadmaps
  for select
  using (auth.uid() = user_id);

create policy if not exists "user_roadmaps_insert_own"
  on public.user_roadmaps
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "user_roadmaps_update_own"
  on public.user_roadmaps
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Update updated_at automatically
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger if not exists set_user_roadmaps_updated_at
before update on public.user_roadmaps
for each row
execute function public.set_updated_at();
