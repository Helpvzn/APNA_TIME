-- =========================================================
-- FAIL-SAFE: AUTO SLOT GENERATION TRIGGER
-- This works even if the App Logic fails or Admin edits DB manually.
-- =========================================================

-- 1. Ensure the Slot Creator Function Exists (Idempotent)
CREATE OR REPLACE FUNCTION public.create_slots_for_org(p_org_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if slots already exist (to prevent duplicates)
    IF EXISTS (SELECT 1 FROM public.availability_slots WHERE organization_id = p_org_id) THEN
        RETURN;
    END IF;

    -- Insert 24/7 Slots (00:00 - 24:00) for all 7 days
    INSERT INTO public.availability_slots (organization_id, day_of_week, start_time, end_time, is_available)
    SELECT 
        p_org_id, 
        day, 
        '00:00:00'::TIME, 
        '24:00:00'::TIME, 
        true
    FROM 
        generate_series(0, 6) AS day; -- All 7 Days
END;
$$;

-- 2. Create the Trigger Function
CREATE OR REPLACE FUNCTION public.trigger_create_slots_on_approve()
RETURNS TRIGGER AS $$
BEGIN
    -- Only run if status changed to 'approved'
    IF NEW.approval_status = 'approved' AND (OLD.approval_status IS DISTINCT FROM 'approved') THEN
        PERFORM public.create_slots_for_org(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach Trigger to Organizations Table
DROP TRIGGER IF EXISTS on_org_approve_create_slots ON public.organizations;
CREATE TRIGGER on_org_approve_create_slots
AFTER UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.trigger_create_slots_on_approve();

-- 4. EMERGENCY BACKFILL: Fix anyone currently approved but missing slots
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM public.organizations WHERE approval_status = 'approved' LOOP
        PERFORM public.create_slots_for_org(r.id);
    END LOOP;
END $$;
