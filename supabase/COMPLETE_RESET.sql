-- ================================================
-- COMPLETE DATABASE RESET - FRESH START
-- ================================================
-- Run this entire script in Supabase Dashboard → SQL Editor
-- This will delete ALL existing data and start fresh

-- ================================================
-- STEP 1: DELETE ALL DATA (Clean Slate)
-- ================================================

-- Delete in correct order to avoid foreign key violations
DELETE FROM appointments;
DELETE FROM availability_slots;
DELETE FROM organizations;
DELETE FROM users;

-- ================================================
-- STEP 2: ENSURE RLS POLICIES ARE CORRECT
-- ================================================

-- Organizations: Public read access
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public organizations are viewable by everyone." ON organizations;
CREATE POLICY "Public organizations are viewable by everyone."
  ON organizations FOR SELECT
  USING (true);

-- Availability Slots: Public read access
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public availability_slots are viewable by everyone." ON availability_slots;
CREATE POLICY "Public availability_slots are viewable by everyone."
  ON availability_slots FOR SELECT
  USING (true);

-- ================================================
-- STEP 3: CREATE YOUR USER & ORGANIZATION
-- ================================================

-- Insert your user (you'll need to sign up again through the UI to get auth.users entry)
-- This is just for reference - actual user will be created via signup
-- The organization will reference your actual user_id from auth.users

-- For now, we'll create the organization with a placeholder
-- You can update it after signing up

-- ================================================
-- STEP 4: VERIFY CURRENT STATE
-- ================================================

-- Check tables are empty
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'availability_slots', COUNT(*) FROM availability_slots
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments;

-- ================================================
-- NEXT STEPS AFTER RUNNING THIS:
-- ================================================
-- 1. Sign up again at: http://localhost:3000/signup
--    - Name: Ranu Saini (or whatever you want)
--    - Email: your email
--    - Password: your password
--    - Business Type: HR (or your choice)
--    - Organization: ranu
--
-- 2. Login to Supabase Dashboard and approve the user in Super Admin
--
-- 3. Run the PART 2 script (will be created) to add availability slots
--    for your newly created organization
-- ================================================
