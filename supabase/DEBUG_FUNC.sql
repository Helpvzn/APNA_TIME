CREATE OR REPLACE FUNCTION get_debug_org_data(p_slug TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    google_connected_email TEXT,
    google_refresh_token TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.email,
        o.google_connected_email,
        o.google_refresh_token
    FROM organizations o
    WHERE o.slug = p_slug;
END;
$$;
