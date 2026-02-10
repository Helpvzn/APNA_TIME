-- ================================================
-- COMPLETE RESET + RE-ADD SLOTS
-- ================================================

-- Step 1: DELETE ALL existing slots
DELETE FROM availability_slots;

-- Step 2: Verify organization exists
SELECT id, name, slug, approval_status 
FROM organizations 
WHERE slug LIKE 'vizan-studio%';

-- Step 3: Make sure org is approved
UPDATE organizations 
SET approval_status = 'approved'
WHERE slug LIKE 'vizan-studio%';

-- Step 4: Add fresh slots (7 days, 24/7)
INSERT INTO availability_slots (organization_id, day_of_week, start_time, end_time, is_active)
SELECT 
    o.id,
    d.day_num,
    '00:00:00'::time,
    '23:59:59'::time,
    true
FROM organizations o
CROSS JOIN (
    SELECT generate_series(0, 6) as day_num
) d
WHERE o.slug LIKE 'vizan-studio%';

-- Step 5: Verify - should show 7 rows
SELECT 
    o.name,
    o.slug,
    a.day_of_week,
    a.start_time,
    a.end_time,
    a.organization_id
FROM organizations o
JOIN availability_slots a ON a.organization_id = o.id
WHERE o.slug LIKE 'vizan-studio%'
ORDER BY a.day_of_week;

-- Step 6: Count check
SELECT COUNT(*) as total_slots FROM availability_slots;
