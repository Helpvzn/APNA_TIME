-- CRITICAL DEBUG: Check if slots exist for this exact org ID
-- Copy the Org ID from browser console (starts with 3f3dd4e9...)

-- Step 1: Find your organization
SELECT id, name, slug, approval_status 
FROM organizations 
WHERE slug LIKE 'vizan-studio%';

-- Step 2: Check slots for YOUR EXACT ORG ID
-- Replace YOUR_ORG_ID_HERE with the ID from Step 1
SELECT COUNT(*) as slot_count
FROM availability_slots
WHERE organization_id = '3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6'; -- REPLACE THIS!

-- Step 3: Show all slots for this org
SELECT *
FROM availability_slots
WHERE organization_id = '3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6'; -- REPLACE THIS!

-- Step 4: Check if there are ANY slots in the table
SELECT COUNT(*) as total_slots FROM availability_slots;

-- Step 5: Show ALL slots with org names
SELECT o.name, o.id, COUNT(a.id) as slot_count
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
GROUP BY o.id, o.name;
