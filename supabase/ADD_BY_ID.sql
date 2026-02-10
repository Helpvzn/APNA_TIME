-- ================================================
-- STEP 2: ADD SLOTS BY ORGANIZATION ID (GUARANTEED TO WORK)
-- ================================================

-- Replace YOUR_ORG_ID with the actual ID from console: 3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6

DELETE FROM availability_slots;

INSERT INTO availability_slots (organization_id, day_of_week, start_time, end_time, is_active)
VALUES
    ('3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6', 0, '00:00:00', '23:59:59', true),
    ('3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6', 1, '00:00:00', '23:59:59', true),
    ('3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6', 2, '00:00:00', '23:59:59', true),
    ('3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6', 3, '00:00:00', '23:59:59', true),
    ('3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6', 4, '00:00:00', '23:59:59', true),
    ('3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6', 5, '00:00:00', '23:59:59', true),
    ('3f3dd4e9-090a-4a08-9dea-ffc0dfd0dbe6', 6, '00:00:00', '23:59:59', true);

-- Verify
SELECT COUNT(*) FROM availability_slots;
-- Should show: 7
