-- =========================================================
-- PERMANENT FIX: AUTOMATE SLOTS FOR NEW USERS (TRIGGER)
-- =========================================================

-- 1. UPDATE THE TRIGGER FUNCTION (Run this once, works forever)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
BEGIN
    -- A. Create Public User Profile
    INSERT INTO public.users (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');

    -- B. Create Organization (Default to 'doctor' for 15-min slots)
    INSERT INTO public.organizations (user_id, name, slug, business_type, approval_status)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'My Organization'),
        'org-' || substr(md5(random()::text), 0, 6), -- Temporary Slug
        'doctor', -- FORCE 15-MIN SLOTS
        'approved' -- AUTO APPROVE
    )
    RETURNING id INTO new_org_id;

    -- C. AUTOMATICALLY INSERT 24/7 SLOTS (00:00 - 24:00)
    INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
    SELECT 
        new_org_id, 
        day, 
        '00:00:00'::TIME, 
        '24:00:00'::TIME, 
        true
    FROM 
        generate_series(0, 6) AS day; -- All 7 Days

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. BACKFILL FIX FOR CURRENT USER (Ram Mandavariya)
-- This fixes the user you just created who has 0 slots.
INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
SELECT 
    org.id, 
    day, 
    '00:00:00'::TIME, 
    '24:00:00'::TIME, 
    true
FROM 
    public.organizations org, 
    generate_series(0, 6) AS day
WHERE 
    NOT EXISTS (
        SELECT 1 FROM public.availability_slots s 
        WHERE s.organization_id = org.id
    );

-- 3. ENSURE ALL ORGS ARE 'doctor' (For 15 min slots)
UPDATE public.organizations SET business_type = 'doctor';
