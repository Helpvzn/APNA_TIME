-- =============================================
-- SET 24/7 AVAILABILITY FOR EVERYONE
-- =============================================

-- 1. DISABLE SECURITY
ALTER TABLE public.availability_slots DISABLE ROW LEVEL SECURITY;

-- 2. DELETE EXISTING SLOTS (Clean slate to avoid overlaps)
DELETE FROM public.availability_slots;

-- 3. INSERT 24-HOUR SLOTS (00:00 - 24:00) FOR ALL DAYS (0-6)
INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
SELECT 
    org.id, 
    day, 
    '00:00:00'::TIME, 
    '24:00:00'::TIME, 
    true
FROM 
    public.organizations org, 
    generate_series(0, 6) AS day; -- All days (Sun-Sat)

-- 4. RE-ENABLE SECURITY
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- 5. VERIFY
SELECT * FROM public.availability_slots LIMIT 10;
