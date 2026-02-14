-- =========================================================
-- FINAL PROJECT FIXER (RUN ONCE - FIXES EVERYTHING)
-- =========================================================

-- 1. FIX DATABASE COLUMNS (So Booking Works)
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS google_event_id TEXT;  

-- 2. AUTOMATE FUTURE USERS (The Trigger)
-- Whenever a new user signs up, this runs automatically:
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
BEGIN
    -- A. Create Profile
    INSERT INTO public.users (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');

    -- B. Create Organization (Doctor Mode = 15 min slots)
    INSERT INTO public.organizations (user_id, name, slug, business_type, approval_status)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'My Organization'),
        'org-' || substr(md5(random()::text), 0, 6),
        'doctor',
        'approved'
    )
    RETURNING id INTO new_org_id;

    -- C. Auto-Create 24/7 Slots
    INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
    SELECT 
        new_org_id, 
        day, 
        '00:00:00'::TIME, 
        '24:00:00'::TIME, 
        true
    FROM 
        generate_series(0, 6) AS day;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. FIX CURRENT DATA (Backfill for Ram & Others)
-- A. Ensure everyone is 'doctor' type
UPDATE public.organizations SET business_type = 'doctor';

-- B. Give Slots to anyone who is missing them
ALTER TABLE public.availability_slots DISABLE ROW LEVEL SECURITY;

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

ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- 4. VERIFY RESULTS
SELECT 'Organizations' as content, count(*) FROM public.organizations
UNION ALL
SELECT 'Slots', count(*) FROM public.availability_slots
UNION ALL
SELECT 'Appointments Columns', count(*) FROM information_schema.columns WHERE table_name = 'appointments' AND column_name IN ('metadata', 'google_event_id');
