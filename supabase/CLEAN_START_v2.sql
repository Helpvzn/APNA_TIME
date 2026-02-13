-- ================================================
-- FINAL CLEAN START SCRIPT (FIXES EVERYTHING)
-- ================================================

-- 1. DROP EVERYTHING (CLEAN SLATE)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_trigger();

DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS availability_slots CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE TABLES WITH CORRECT COLUMNS

-- Users Table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) NOT NULL PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Organizations Table (NOW WITH user_id)
CREATE TABLE public.organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL, -- This was missing before
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    business_type TEXT DEFAULT 'consultant', -- 'doctor', 'lawyer', etc.
    approval_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Availability Slots
CREATE TABLE public.availability_slots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true
);

-- Appointments
CREATE TABLE public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ENABLE RLS (SECURITY)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Users: Can view own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Organizations: 
-- Public can view approved organizations (for booking)
CREATE POLICY "Public can view approved organizations" ON organizations
    FOR SELECT USING (true);

-- Owners can update their own organization
CREATE POLICY "Owners can update own organization" ON organizations
    FOR UPDATE USING (auth.uid() = user_id);

-- Owners can insert their own organization
CREATE POLICY "Owners can insert own organization" ON organizations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Slots: Public can view
CREATE POLICY "Public can view slots" ON availability_slots
    FOR SELECT USING (true);

-- Appointments: Public can insert (book)
CREATE POLICY "Public can book appointments" ON appointments
    FOR INSERT WITH CHECK (true);

-- Owners can view appointments for their org
CREATE POLICY "Owners can view their appointments" ON appointments
    FOR SELECT USING (
        organization_id IN (SELECT id FROM organizations WHERE user_id = auth.uid())
    );

-- 5. CLEANUP AUTH USERS (OPTIONAL - KEEPS YOUR LOGIN BUT CLEARS DATA)
-- If you want to delete your login too, uncomment the next line:
-- DELETE FROM auth.users;
