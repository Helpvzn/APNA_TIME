-- ========================================
-- COPY THIS ENTIRE THING AND RUN IN SUPABASE
-- ========================================

-- Get the organization ID for vizan-studio
DO $$
DECLARE
    org_id UUID;
BEGIN
    -- Get organization ID
    SELECT id INTO org_id 
    FROM organizations 
    WHERE slug LIKE 'vizan-studio%';
    
    -- Approve it
    UPDATE organizations 
    SET approval_status = 'approved' 
    WHERE id = org_id;
    
    -- Delete old slots if any
    DELETE FROM availability_slots WHERE organization_id = org_id;
    
    -- Add fresh slots for all 7 days
    INSERT INTO availability_slots (organization_id, day_of_week, start_time, end_time, is_active)
    VALUES
        (org_id, 0, '00:00:00', '23:59:59', true),  -- Sunday
        (org_id, 1, '00:00:00', '23:59:59', true),  -- Monday
        (org_id, 2, '00:00:00', '23:59:59', true),  -- Tuesday
        (org_id, 3, '00:00:00', '23:59:59', true),  -- Wednesday
        (org_id, 4, '00:00:00', '23:59:59', true),  -- Thursday
        (org_id, 5, '00:00:00', '23:59:59', true),  -- Friday
        (org_id, 6, '00:00:00', '23:59:59', true);  -- Saturday
    
    RAISE NOTICE 'Added 7 slots for organization: %', org_id;
END $$;

-- Verify
SELECT 
    o.name,
    o.slug,
    o.approval_status,
    COUNT(a.id) as slots_added
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
WHERE o.slug LIKE 'vizan-studio%'
GROUP BY o.id, o.name, o.slug, o.approval_status;
