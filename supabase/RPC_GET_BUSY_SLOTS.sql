-- =========================================================
-- SECURE BUSY SLOTS FETCHER (RPC)
-- Allows public to see "Sold" times without seeing "Who" booked.
-- =========================================================

CREATE OR REPLACE FUNCTION public.get_busy_intervals(
    p_organization_id UUID, 
    p_start_time TIMESTAMPTZ, 
    p_end_time TIMESTAMPTZ
)
RETURNS TABLE (start_time TIMESTAMPTZ, end_time TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with Admin privileges (Bypasses RLS)
SET search_path = public -- Security best practice
AS $$
BEGIN
    RETURN QUERY
    SELECT a.start_time, a.end_time
    FROM public.appointments a
    WHERE a.organization_id = p_organization_id
      AND a.start_time >= p_start_time
      AND a.start_time <= p_end_time
      AND a.status != 'cancelled';
END;
$$;

-- Grant access to everyone (User is checking availability)
GRANT EXECUTE ON FUNCTION public.get_busy_intervals(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO anon, authenticated, service_role;
