-- ================================================
-- STEP 1: FIND ALL ORGANIZATIONS
-- ================================================
SELECT id, name, slug, approval_status, created_at
FROM organizations
ORDER BY created_at DESC;

-- This will show you ALL organizations
-- Find the one you're using and copy its slug or id
