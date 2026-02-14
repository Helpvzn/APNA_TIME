import { createClient } from '@/utils/supabase/server'
import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { oauth2Client } from '@/lib/google-calendar'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') // e.g. ram-mandavariya-5mny5

    if (!slug) return NextResponse.json({ error: 'Missing slug param' })

    const supabase = await createClient()

    // 1. Get Org
    const { data: org } = await supabase
        .from('organizations')
        .select('id, email, google_connected_email, google_refresh_token')
        .eq('slug', slug)
        .single()

    if (!org) return NextResponse.json({ error: 'Org not found' })

    // 2. Check Token
    if (!org.google_refresh_token) {
        return NextResponse.json({
            status: 'Disconnected',
            message: 'No refresh token found in DB'
        })
    }

    try {
        // 3. Test GCal Fetch
        oauth2Client.setCredentials({ refresh_token: org.google_refresh_token })
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

        // Check for "Tomorrow" (or specifically Feb 16 2026 based on user report)
        const timeMin = '2026-02-16T00:00:00Z'
        const timeMax = '2026-02-17T00:00:00Z'

        // A. List Events (Full Details)
        const eventsResponse = await calendar.events.list({
            calendarId: 'primary',
            timeMin,
            timeMax,
            singleEvents: true, // Expand recurring events
        })

        // B. FreeBusy Query (What the app uses)
        const freeBusyResponse = await calendar.freebusy.query({
            requestBody: {
                timeMin,
                timeMax,
                items: [{ id: 'primary' }]
            }
        })

        return NextResponse.json({
            status: 'Connected',
            connected_email: org.google_connected_email,
            token_preview: org.google_refresh_token.substring(0, 10) + '...',
            debug_time_range: { timeMin, timeMax },
            raw_events: eventsResponse.data.items?.map(e => ({
                summary: e.summary,
                start: e.start,
                end: e.end,
                transparency: e.transparency // 'transparent' means "Available", missing/opaque means "Busy"
            })),
            freebusy_result: freeBusyResponse.data.calendars?.primary?.busy
        })

    } catch (error: any) {
        return NextResponse.json({
            status: 'Error',
            message: error.message,
            stack: error.stack
        })
    }
}
