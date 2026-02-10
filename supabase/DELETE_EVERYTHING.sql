-- ================================================
-- STEP 1: DELETE ALL AUTH USERS (MOST IMPORTANT)
-- ================================================
-- This removes ALL signup accounts from Supabase Auth
-- Run this FIRST

DELETE FROM auth.users;

-- ================================================
-- STEP 2: DELETE ALL APPLICATION DATA
-- ================================================

TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE availability_slots CASCADE;
TRUNCATE TABLE organizations CASCADE;
TRUNCATE TABLE users CASCADE;

-- ================================================
-- STEP 3: VERIFY EVERYTHING IS 0
-- ================================================

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
SELECT 'appointments', COUNT(*) FROM appointments
ORDER BY table_name;

-- ================================================
-- EXPECTED RESULT:
-- All counts should be 0
-- If not 0, something went wrong!
-- ================================================
