import { google } from 'googleapis'

export const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
)

export const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email'
]

export async function getGoogleBusyIntervals(refreshToken: string, start: string, end: string) {
    try {
        const auth = oauth2Client
        // We need to create a new instance or clone it to avoid side effects if reused concurrently with different tokens?
        // Actually simpler to just use the new instance pattern inside the function as before, but actions.ts needs the client.
        // Let's keep the function independent but export the client for manual use.

        const client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        )

        auth.setCredentials({ refresh_token: refreshToken })

        const calendar = google.calendar({ version: 'v3', auth })

        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: start,
                timeMax: end,
                items: [{ id: 'primary' }] // Check primary calendar
            }
        })

        const busy = response.data.calendars?.primary?.busy || []

        // Convert to compatible format
        return busy.map(event => ({
            start_time: event.start!, // RFC3339 format
            end_time: event.end!      // RFC3339 format
        }))

    } catch (error) {
        console.error('Google Calendar Sync Error:', error)
        // Fail gracefully - if GCal fails, don't crash the whole app, just return empty
        // In production, we might want to alert the user their token is invalid
        return []
    }
}
