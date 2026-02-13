-- =============================================
-- FIX MISSING COLUMNS (METADATA & GOOGLE ID)
-- =============================================

-- 1. Add 'metadata' column (JSONB)
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Add 'google_event_id' column (TEXT)
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS google_event_id TEXT;

-- 3. VERIFY
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'appointments';
