-- Check what's actually in the database for vizan-studio
SELECT 
    o.name,
    o.slug,
    a.day_of_week,
    a.start_time,
    a.end_time,
    a.is_active
FROM organizations o
JOIN availability_slots a ON a.organization_id = o.id
WHERE o.slug LIKE 'vizan-studio%'
ORDER BY a.day_of_week;

-- This will show us EXACTLY what day_of_week values are stored
