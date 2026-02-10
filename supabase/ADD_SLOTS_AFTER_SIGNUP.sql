-- ================================================
-- PART 2: ADD AVAILABILITY SLOTS AFTER SIGNUP
-- ================================================
-- Run this AFTER you've signed up and been approved
-- This adds 24/7 availability for ALL approved organizations

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

-- Verify slots were added
SELECT 
    o.name as organization_name,
    o.slug,
    COUNT(a.id) as slot_count
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
GROUP BY o.id, o.name, o.slug;

-- Show details
SELECT 
    o.name,
    o.slug,
    a.day_of_week,
    a.start_time,
    a.end_time,
    a.is_active
FROM organizations o
JOIN availability_slots a ON a.organization_id = o.id
ORDER BY o.name, a.day_of_week;
