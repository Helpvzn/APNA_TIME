-- Add Google Calendar Integration Columns
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS google_calendar_id TEXT DEFAULT 'primary',
ADD COLUMN IF NOT EXISTS google_connected_email TEXT,
ADD COLUMN IF NOT EXISTS google_updated_at TIMESTAMP WITH TIME ZONE;
