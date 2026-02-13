-- Add Default Slots (Mon-Fri, 9am-5pm)
INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
SELECT 
    org.id, 
    day, 
    '09:00:00'::TIME, 
    '17:00:00'::TIME, 
    true
FROM 
    public.organizations org, 
    generate_series(1, 5) AS day
WHERE 
    org.user_id = '1440f690-1e62-460b-9479-866f2d3f84a5'
    AND NOT EXISTS (
        SELECT 1 FROM public.availability_slots s 
        WHERE s.organization_id = org.id
    );

-- Verify
SELECT * FROM public.availability_slots 
WHERE organization_id IN (
    SELECT id FROM public.organizations 
    WHERE user_id = '1440f690-1e62-460b-9479-866f2d3f84a5'
);
