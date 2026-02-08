# Deploying APNA TIME to Vercel

This guide will walk you through deploying your appointment booking system to Vercel for free.

## Prerequisites

1.  A [GitHub](https://github.com/) account (where your code is now).
2.  A [Vercel](https://vercel.com/) account (you can sign up using GitHub).
3.  A [Supabase](https://supabase.com/) project (which you already have).
4.  A [Google Cloud Console](https://console.cloud.google.com/) project (for the Calendar API).

## Step 1: Import Project to Vercel

1.  Log in to your Vercel dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Search for your repository **`APNA_TIME`** (or `Helpvzn/APNA_TIME`).
5.  Click **"Import"**.

## Step 2: Configure Project

1.  **Framework Preset**: Select **Next.js** (it should be automatic).
2.  **Root Directory**: Ensure this is set to `web` if your `package.json` is inside a `web` folder. Based on our work, you are working inside `c:\Users\Vizan\Desktop\apna time\web`, so if the repo root is `apna time`, set Root Directory to `web`.
    *   *Self-Check*: If your repo structure is `root -> package.json`, leave it as `./`. If it is `root -> web -> package.json`, set it to `web`.

## Step 3: Add Environment Variables

You need to copy the secrets from your local `.env.local` file to Vercel.

1.  Expand the **"Environment Variables"** section.
2.  Add the following keys and values (copy them from your local project):

| Key | Value Source | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Local `.env` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Local `.env` | Your Supabase Anon Key |
| `GOOGLE_CLIENT_ID` | Local `.env` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Local `.env` | Google OAuth Client Secret |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | The URL Vercel gives you (add this *after* first deployment or guess it now e.g. `https://apna-time.vercel.app`) |

**Important:** For the Google Calendar integration to work, you must add your Vercel URL to the **"Authorized redirect URIs"** in your Google Cloud Console.
*   Go to Google Cloud Console -> APIs & Services -> Credentials.
*   Edit your OAuth 2.0 Client ID.
*   Add URI: `https://<your-vercel-project-name>.vercel.app/api/integrations/google/callback`

## Step 4: Deploy

1.  Click **"Deploy"**.
2.  Wait for the build to complete.
3.  Once finished, you will see a preview of your live site!

## Troubleshooting

*   **Google Auth Error**: If Google login fails, double-check that you added the Vercel URL to the Google Cloud Console "Authorized redirect URIs".
*   **Database Error**: Ensure your Supabase project allows connections from Vercel (usually open by default).

---
**Enjoy your live SaaS!**
