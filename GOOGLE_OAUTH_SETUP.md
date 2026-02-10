# Google OAuth Setup Guide

## Step 1: Google Cloud Console Setup

1. Go to: https://console.cloud.google.com
2. Create new project or select existing project
3. Click **APIs & Services** → **Credentials** (left sidebar)
4. Click **Create Credentials** → **OAuth 2.0 Client ID**

### Configure Consent Screen (if prompted):
- App name: `ApnaTime Appointments`
- User support email: Your email
- Developer email: Your email
- Click **Save and Continue**

### Create OAuth Client:
- Application type: **Web application**
- Name: `ApnaTime Web Client`
- **Authorized redirect URIs** - Add BOTH:
  ```
  http://localhost:3000/auth/callback
  https://ovkwqjcxnkornggtsfkk.supabase.co/auth/v1/callback
  ```
- Click **Create**
- **COPY** the Client ID and Client Secret (you'll need them next)

---

## Step 2: Enable Google Provider in Supabase

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** (left sidebar) → **Providers**
4. Scroll to **Google** provider
5. Toggle **Enable Sign in with Google**
6. Paste:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
7. Click **Save**

---

## Step 3: Test Google OAuth

1. Open: http://localhost:3000/signup
2. Click **"Continue with Google"** button
3. Select your Google account
4. You should be redirected back
5. Check Supabase Dashboard:
   - **Authentication** → **Users** (should see new user)
   - **Table Editor** → **organizations** (should see new org with pending status)

---

## Step 4: Approve Your Account

### Option A: Via SQL Editor
```sql
UPDATE organizations SET approval_status = 'approved';
```

### Option B: Via Super Admin Page
1. Login to: http://localhost:3000/admin/super
2. Find your organization
3. Click "Approve"

---

## Step 5: Add Availability Slots

After approval, add 24/7 slots:

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

---

## ✅ You're Done!

- Login at: http://localhost:3000/login
- Click "Continue with Google"
- You should go directly to Admin Dashboard

---

## Troubleshooting

### "Failed to sign in with Google"
- Check Client ID and Secret are correct in Supabase
- Check redirect URIs match exactly

### "No slots available" on booking page
- Run the SQL in Step 5 to add availability slots

### Still stuck at pending page after approval
- Log out and log back in with Google
- Check SQL: `SELECT approval_status FROM organizations;`
