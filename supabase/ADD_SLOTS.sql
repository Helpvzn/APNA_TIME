-- ADD 24/7 AVAILABILITY FOR ALL ORGANIZATIONS
-- Run this in Supabase Dashboard -> SQL Editor

-- First, let's see what we have
SELECT 
    o.name,
    o.slug,
    COUNT(a.id) as slot_count
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
GROUP BY o.id, o.name, o.slug;

-- Now add 24/7 slots for organizations that don't have any
-- This creates slots for ALL 7 days of the week, 24 hours

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
WHERE NOT EXISTS (
    SELECT 1 
    FROM availability_slots a 
    WHERE a.organization_id = o.id 
    AND a.day_of_week = day_num
)
AND o.approval_status = 'approved';

-- Verify the insert
SELECT 
    o.name,
    o.slug,
    COUNT(a.id) as slot_count
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
GROUP BY o.id, o.name, o.slug;
