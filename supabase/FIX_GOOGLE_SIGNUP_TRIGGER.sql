-- =========================================================
-- FINAL TRIGGER FIX FOR GOOGLE AUTH & ALL SIGNUPS
-- =========================================================

-- 1. DROP EXISTING TRIGGER FIRST (To be safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. RECREATE THE FUNCTION (Targeting correct table: 'profiles')
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
    user_full_name TEXT;
    user_email TEXT;
BEGIN
    -- Get Metadata safely
    user_full_name := COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User');
    user_email := COALESCE(new.email, 'no-email@example.com');

    -- A. Create Public Profile (Table is 'profiles', NOT 'users')
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new.id, user_email, user_full_name)
    ON CONFLICT (id) DO UPDATE SET 
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    -- B. Create Organization
    INSERT INTO public.organizations (user_id, name, slug, business_type, approval_status)
    VALUES (
        new.id,
        COALESCE(user_full_name, 'My Organization'),
        'org-' || substr(md5(random()::text), 0, 8), -- Random Slug
        'doctor', -- FORCE 15-MIN SLOTS
        'approved'
    )
    RETURNING id INTO new_org_id;

    -- C. INSERT 24/7 SLOTS (00:00 - 24:00)
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

-- 3. RE-ATTACH TRIGGER
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- REPAIR BROKEN USERS (Who signed up but have no slots)
-- =========================================================

DO $$
DECLARE
    r RECORD;
    org_id UUID;
BEGIN
    -- For every user who lacks an organization
    FOR r IN SELECT * FROM auth.users u WHERE NOT EXISTS (SELECT 1 FROM public.organizations o WHERE o.user_id = u.id) LOOP
        
        -- 1. Ensure Profile Exists
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (r.id, r.email, COALESCE(r.raw_user_meta_data->>'full_name', 'Recovered User'))
        ON CONFLICT (id) DO NOTHING;

        -- 2. Create Missing Organization
        INSERT INTO public.organizations (user_id, name, slug, business_type, approval_status)
        VALUES (
            r.id, 
            COALESCE(r.raw_user_meta_data->>'full_name', 'My Organization'),
            'org-' || substr(md5(random()::text), 0, 8),
            'doctor',
            'approved'
        )
        RETURNING id INTO org_id;

        -- 3. Create Slots
        INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
        SELECT 
            org_id, 
            day, 
            '00:00:00'::TIME, 
            '24:00:00'::TIME, 
            true
        FROM 
            generate_series(0, 6) AS day;
            
    END LOOP;
END $$;
