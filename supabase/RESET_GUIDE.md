# Database Reset Guide

## Problem
Database mein data inconsistent ho gaya hai - slots missing, RLS issues, etc. 

## Solution: Fresh Start

### Step 1: Complete Reset

1. **Supabase Dashboard** kholo
2. **SQL Editor** mein jao
3. File check karo: `supabase/COMPLETE_RESET.sql`
4. Ya ye SQL run karo:

```sql
-- Delete all data
DELETE FROM appointments;
DELETE FROM availability_slots;
DELETE FROM organizations;
DELETE FROM users;

-- Verify empty
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'availability_slots', COUNT(*) FROM availability_slots
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments;
```

Should show all 0s.

### Step 2: Sign Up Fresh

1. Go to: **http://localhost:3000/signup**
2. Sign up with:
   - Name: Ranu Saini (or kuch bhi)
   - Email: tumhara email
   - Password: tumhara password
   - Business Type: HR (ya jo chahiye)
   - Organization Slug: `ranu-a4a8` (same as before if you want)

### Step 3: Approve Yourself

1. **Supabase Dashboard** → **SQL Editor**
2. Run this:

```sql
-- Check your new organization
SELECT * FROM organizations;

-- Approve it
UPDATE organizations 
SET approval_status = 'approved' 
WHERE slug = 'ranu-a4a8';  -- your slug
```

### Step 4: Add Availability Slots

1. File: `supabase/ADD_SLOTS_AFTER_SIGNUP.sql`
2. Ya run this:

```sql
INSERT INTO availability_slots (organization_id, day_of_week, start_time, end_time, is_active)
SELECT 
    o.id,
    generate_series(0, 6) as day_of_week,
    '00:00:00',
    '23:59:59',
    true
FROM organizations o
WHERE o.approval_status = 'approved';
```

### Step 5: Test

1. Go to: **http://localhost:3000/book/ranu-a4a8**
2. Select any date
3. **Slots dikhne chahiye!**

## Files Created

- `supabase/COMPLETE_RESET.sql` - Full reset script
- `supabase/ADD_SLOTS_AFTER_SIGNUP.sql` - Add slots after approval
- `supabase/RESET_GUIDE.md` - This file
