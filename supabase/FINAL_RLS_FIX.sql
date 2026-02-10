-- ================================================
-- FINAL FIX: RLS Policy for Public Read Access
-- ================================================

-- Step 1: Enable RLS (if not already)
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- Step 2: DROP old policies if they exist
DROP POLICY IF EXISTS "Public can view active availability slots" ON availability_slots;
DROP POLICY IF EXISTS "Anyone can view availability slots" ON availability_slots;
DROP POLICY IF EXISTS "Public read access" ON availability_slots;

-- Step 3: CREATE proper public read policy
CREATE POLICY "Public read access to active slots"
ON availability_slots
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Step 4: Verify RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'availability_slots';

-- Step 5: Test query as anonymous user
SELECT COUNT(*) as slot_count
FROM availability_slots
WHERE is_active = true;

-- Expected: Should show 7
