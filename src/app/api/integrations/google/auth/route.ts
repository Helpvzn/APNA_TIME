import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const supabase = await createClient()

    // Check if user is authenticated (Optional but recommended)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${new URL(request.url).origin}/api/integrations/google/callback`
    )

    // Generate Auth URL
    const scopes = [
        'https://www.googleapis.com/auth/calendar',       // Read/Write Calendar
        'https://www.googleapis.com/auth/userinfo.email', // Identify User
    ]

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // CRITICAL: To get Refresh Token
        scope: scopes,
        prompt: 'consent',      // CRITICAL: Forces Refresh Token on re-auth
        state: user.id          // Security: Pass user ID to verify in callback
    })

    return NextResponse.redirect(url)
}
