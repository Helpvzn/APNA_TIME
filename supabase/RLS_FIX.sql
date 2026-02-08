
-- RUN THIS IN SUPABASE DASHBOARD -> SQL EDITOR

-- 1. Enable RLS (just in case)
alter table availability_slots enable row level security;

-- 2. Drop existing policy if any (to avoid conflict)
drop policy if exists "Public availability_slots are viewable by everyone." on availability_slots;

-- 3. Create Policy allowing everyone to see availability
create policy "Public availability_slots are viewable by everyone."
  on availability_slots for select
  using ( true );

-- 4. Also Ensure Organizations are publicly viewable (Double Check)
alter table organizations enable row level security;
drop policy if exists "Public organizations are viewable by everyone." on organizations;
create policy "Public organizations are viewable by everyone."
  on organizations for select
  using ( true );
