-- CONFIRMED ORGANIZATION ID: 15ceeea0-f310-4c02-83cf-20123ef94adf
-- Name: ranu
-- Slug: ranu-a4a8

-- This will insert 7 availability slots (one for each day of the week)
-- Day 0 = Sunday, 1 = Monday, ..., 6 = Saturday

INSERT INTO availability_slots (organization_id, day_of_week, start_time, end_time, is_active) VALUES
('15ceeea0-f310-4c02-83cf-20123ef94adf', 0, '00:00:00', '23:59:59', true),
('15ceeea0-f310-4c02-83cf-20123ef94adf', 1, '00:00:00', '23:59:59', true),
('15ceeea0-f310-4c02-83cf-20123ef94adf', 2, '00:00:00', '23:59:59', true),
('15ceeea0-f310-4c02-83cf-20123ef94adf', 3, '00:00:00', '23:59:59', true),
('15ceeea0-f310-4c02-83cf-20123ef94adf', 4, '00:00:00', '23:59:59', true),
('15ceeea0-f310-4c02-83cf-20123ef94adf', 5, '00:00:00', '23:59:59', true),
('15ceeea0-f310-4c02-83cf-20123ef94adf', 6, '00:00:00', '23:59:59', true);

-- Verify insertion
SELECT 
    day_of_week,
    start_time,
    end_time,
    is_active
FROM availability_slots
WHERE organization_id = '15ceeea0-f310-4c02-83cf-20123ef94adf'
ORDER BY day_of_week;
