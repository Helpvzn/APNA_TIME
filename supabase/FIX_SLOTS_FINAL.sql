-- FINAL FIX: Add 24/7 Availability Slots
-- This will add slots for ALL days (Sunday-Saturday) for your organization

-- First check what exists
SELECT 
    o.name,
    o.slug,
    COUNT(a.id) as current_slot_count
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
WHERE o.slug = 'ranu-a4a8'
GROUP BY o.id, o.name, o.slug;

-- Now insert 24/7 slots (all 7 days)
INSERT INTO availability_slots (organization_id, day_of_week, start_time, end_time, is_active)
SELECT 
    o.id,
    generate_series(0, 6) as day_of_week,
    '00:00:00' as start_time,
    '23:59:59' as end_time,
    true
FROM organizations o
WHERE o.slug = 'ranu-a4a8'
AND NOT EXISTS (
    SELECT 1 FROM availability_slots a 
    WHERE a.organization_id = o.id
);

-- Verify it worked
SELECT 
    o.name,
    o.slug,
    COUNT(a.id) as new_slot_count
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
WHERE o.slug = 'ranu-a4a8'
GROUP BY o.id, o.name, o.slug;

-- Show all slots
SELECT 
    day_of_week,
    start_time,
    end_time,
    is_active
FROM availability_slots a
JOIN organizations o ON o.id = a.organization_id
WHERE o.slug = 'ranu-a4a8'
ORDER BY day_of_week;
