-- =============================================
-- FORCE 15-MINUTE SLOTS (SWITCH TO DOCTOR MODE)
-- =============================================

-- 1. UPDATE BUSINESS TYPE TO 'doctor' (Configured for 15 mins)
UPDATE public.organizations
SET business_type = 'doctor'
WHERE user_id = '1440f690-1e62-460b-9479-866f2d3f84a5';

-- 2. VERIFY
SELECT name, business_type FROM public.organizations WHERE user_id = '1440f690-1e62-460b-9479-866f2d3f84a5';
