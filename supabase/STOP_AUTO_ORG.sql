-- =========================================================
-- STOP AUTOMATIC ORG CREATION (ONBOARDING FLOW START)
-- =========================================================

-- 1. DROP EXISTING TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. RECREATE FUNCTION (PROFILE ONLY)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    -- Only Create User Profile. 
    -- Do NOT create Org. Do NOT create Slots.
    -- Let the user do this via the Onboarding UI.
    
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User')
    )
    ON CONFLICT (id) DO UPDATE SET 
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RE-ATTACH TRIGGER
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
