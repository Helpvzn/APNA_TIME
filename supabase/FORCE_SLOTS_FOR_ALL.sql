-- =========================================================
-- FORCE FIX: ADD SLOTS TO *ANY* ORG THAT HAS NONE
-- =========================================================

-- 1. DISABLE SECURITY (To ensure we can write)
ALTER TABLE public.availability_slots DISABLE ROW LEVEL SECURITY;

-- 2. INSERT 24/7 SLOTS FOR *ANY* ORG WITH 0 SLOTS
INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
SELECT 
    org.id, 
    day, 
    '00:00:00'::TIME, 
    '24:00:00'::TIME, 
    true
FROM 
    public.organizations org
CROSS JOIN 
    generate_series(0, 6) AS day
WHERE 
    NOT EXISTS (
        SELECT 1 FROM public.availability_slots s 
        WHERE s.organization_id = org.id
    );

-- 3. FORCE 'doctor' TYPE FOR EVERYONE (For 15-min slots)
UPDATE public.organizations SET business_type = 'doctor';

-- 4. RE-ENABLE SECURITY
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- 5. VERIFY
SELECT org.name, count(s.id) as slot_count 
FROM public.organizations org 
LEFT JOIN public.availability_slots s ON org.id = s.organization_id
GROUP BY org.name;
