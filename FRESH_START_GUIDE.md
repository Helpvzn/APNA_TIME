# 🔥 COMPLETE FRESH START - STEP BY STEP

## Problem
Database corrupt hai, slots nahi dikh rahe. Sab delete karke fresh start karna hai.

---

## ⚠️ STEP 1: NUCLEAR RESET (Supabase)

1. **Supabase Dashboard** kholo: https://supabase.com/dashboard
2. Apna project select karo
3. **SQL Editor** par jao
4. Ye SQL paste karo aur **RUN** karo:

```sql
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE availability_slots CASCADE;
TRUNCATE TABLE organizations CASCADE;
TRUNCATE TABLE users CASCADE;
DELETE FROM auth.users;
```

✅ Success message dikhna chahiye.

---

## 🏠 STEP 2: HOME PAGE SE START KARO

1. Browser mein jao: **http://localhost:3000**
2. Tumhe landing page dikhna chahiye
3. **"Sign Up"** button par click karo

---

## 📝 STEP 3: FRESH SIGNUP

1. Ye details bharo:
   - **Name**: Ranu Saini (ya koi bhi naam)
   - **Email**: tumhara email
   - **Password**: tumhara password
   - **Business Type**: HR (ya koi bhi category)
   - **Organization Name**: Ranu Appointments (ya koi bhi naam)

2. **Sign Up** par click karo

3. Message dikhega: "Check your email..." 
   - Email check karne ki zaroorat NAHI hai (localhost testing hai)
   - Bas aage badho

---

## ✅ STEP 4: APPROVE YOURSELF (Supabase)

1. **Supabase Dashboard** → **SQL Editor**
2. Pehle check karo ki organization bana ya nahi:

```sql
SELECT * FROM organizations;
```

3. Agar organization dikha, toh approve karo:

```sql
UPDATE organizations 
SET approval_status = 'approved';
```

---

## 📅 STEP 5: ADD AVAILABILITY SLOTS (Supabase)

Ye SQL **CAREFULLY** run karo:

```sql
INSERT INTO availability_slots (organization_id, day_of_week, start_time, end_time, is_active)
SELECT 
    o.id,
    generate_series(0, 6) as day_of_week,
    '00:00:00' as start_time,
    '23:59:59' as end_time,
    true
FROM organizations o
WHERE o.approval_status = 'approved';
```

✅ Should say "7 rows inserted"

---

## 🧪 STEP 6: VERIFY & TEST

1. Check slots were added:

```sql
SELECT 
    o.name,
    o.slug,
    COUNT(a.id) as slot_count
FROM organizations o
LEFT JOIN availability_slots a ON a.organization_id = o.id
GROUP BY o.id, o.name, o.slug;
```

Should show: `slot_count = 7`

2. **Get your booking link:**

```sql
SELECT slug FROM organizations;
```

Copy the slug (e.g., "ranu-appointments")

3. **Test the booking page:**
   - Browser mein jao: `http://localhost:3000/book/YOUR-SLUG`
   - Replace `YOUR-SLUG` with actual slug
   - Date select karo
   - **SLOTS DIKHNE CHAHIYE!** ✅

---

## 🎉 SUCCESS!

Agar slots dikh gaye:
1. Login karo: `http://localhost:3000/login`
2. Admin Dashboard dekho
3. Booking link copy karo
4. Share with clients!

---

## ❌ Agar Abhi Bhi Nahi Dikhe

Screenshot bhejo with:
1. Browser console (F12 → Console tab)
2. Supabase SQL result (slot count query)
