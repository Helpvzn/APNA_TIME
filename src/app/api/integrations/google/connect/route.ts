import { NextResponse } from 'next/server'
import { oauth2Client, SCOPES } from '@/lib/google-calendar'

export async function GET() {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Request refresh token
        scope: SCOPES,
        prompt: 'consent' // Force consent to ensure refresh token is returned
    })

    return NextResponse.redirect(url)
}
