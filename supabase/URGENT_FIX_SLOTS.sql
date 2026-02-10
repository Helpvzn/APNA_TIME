-- ================================================
-- IMMEDIATE FIX: Add Slots for "vizan studio"
-- ================================================
-- Copy and run this in Supabase Dashboard → SQL Editor

-- Step 1: Check current state
SELECT 
    o.name,
    o.slug,
    o.id,
    o.approval_status,
    COUNT(a.id) as slot_count
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
WHERE o.slug LIKE 'vizan-studio%'
GROUP BY o.id, o.name, o.slug, o.approval_status;

-- Step 2: Approve the organization (if pending)
UPDATE organizations 
SET approval_status = 'approved'
WHERE slug LIKE 'vizan-studio%';

-- Step 3: Add 24/7 availability slots for ALL approved organizations
INSERT INTO availability_slots (organization_id, day_of_week, start_time, end_time, is_active)
SELECT 
    o.id as organization_id,
    day_num as day_of_week,
    '00:00:00' as start_time,
    '23:59:59' as end_time,
    true as is_active
FROM 
    organizations o,
    generate_series(0, 6) as day_num
WHERE o.approval_status = 'approved'
AND NOT EXISTS (
    SELECT 1 
    FROM availability_slots a 
    WHERE a.organization_id = o.id 
    AND a.day_of_week = day_num
);

-- Step 4: Verify slots were added
SELECT 
    o.name,
    o.slug,
    COUNT(a.id) as slot_count
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
GROUP BY o.id, o.name, o.slug;

-- Expected: slot_count should be 7

-- Step 5: Show all slots
SELECT 
    o.name,
    a.day_of_week,
    a.start_time,
    a.end_time,
    a.is_active
FROM organizations o
JOIN availability_slots a ON a.organization_id = o.id
ORDER BY o.name, a.day_of_week;
