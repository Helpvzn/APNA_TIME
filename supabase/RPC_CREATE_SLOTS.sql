-- =========================================================
-- GENERATE SLOTS RPC (For Admin Approval Action)
-- =========================================================

CREATE OR REPLACE FUNCTION public.create_slots_for_org(p_org_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 1. Check if slots already exist (to prevent duplicates)
    IF EXISTS (SELECT 1 FROM public.availability_slots WHERE organization_id = p_org_id) THEN
        RETURN;
    END IF;

    -- 2. Insert 24/7 Slots (00:00 - 24:00) for all 7 days
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

-- Grant execute to authenticated users (so Server Action can call it)
GRANT EXECUTE ON FUNCTION public.create_slots_for_org(UUID) TO authenticated, service_role;
