-- =============================================
-- EXTEND SLOTS (MORNING & EVENING) FOR EVERYONE
-- =============================================

-- 1. DISABLE SECURITY
ALTER TABLE public.availability_slots DISABLE ROW LEVEL SECURITY;

-- 2. INSERT EARLY MORNING SLOTS (7 AM - 9 AM)
INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
SELECT 
    org.id, 
    day, 
    '07:00:00'::TIME, 
    '09:00:00'::TIME, 
    true
FROM 
    public.organizations org, 
    generate_series(0, 6) AS day -- All days (Sun-Sat)
WHERE 
    NOT EXISTS (
        SELECT 1 FROM public.availability_slots s 
        WHERE s.organization_id = org.id 
        AND s.day_of_week = day 
        AND s.start_time = '07:00:00'::TIME
    );

-- 3. INSERT EVENING SLOTS (5 PM - 9 PM)
INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
SELECT 
    org.id, 
    day, 
    '17:00:00'::TIME, 
    '21:00:00'::TIME, 
    true
FROM 
    public.organizations org, 
    generate_series(0, 6) AS day -- All days (Sun-Sat)
WHERE 
    NOT EXISTS (
        SELECT 1 FROM public.availability_slots s 
        WHERE s.organization_id = org.id 
        AND s.day_of_week = day 
        AND s.start_time = '17:00:00'::TIME
    );

-- 4. RE-ENABLE SECURITY
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- 5. VERIFY COUNT
SELECT COUNT(*) as total_slots FROM public.availability_slots;
