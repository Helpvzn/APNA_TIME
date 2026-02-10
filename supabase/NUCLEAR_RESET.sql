-- ================================================
-- NUCLEAR OPTION: COMPLETE DATABASE WIPE
-- ================================================
-- This deletes EVERYTHING. You will start from ZERO.
-- Run in Supabase Dashboard → SQL Editor

-- Step 1: Delete all application data
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE availability_slots CASCADE;
TRUNCATE TABLE organizations CASCADE;
TRUNCATE TABLE users CASCADE;

-- Step 2: Delete all auth users (your signup accounts)
-- WARNING: This deletes ALL user accounts
DELETE FROM auth.users;

-- Step 3: Verify everything is empty
SELECT 
    'auth.users' as table_name, 
    COUNT(*) as count 
FROM auth.users
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'availability_slots', COUNT(*) FROM availability_slots
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments;

-- Expected result: All counts should be 0
