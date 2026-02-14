'use server'

import { createClient } from '@/utils/supabase/server'
import { startOfDay, endOfDay, subDays, addDays } from 'date-fns'
import { getGoogleBusyIntervals } from '@/lib/google-calendar'

export async function getAppointmentsForDate(organizationId: string, date: Date) {
    const supabase = await createClient()

    // Widen the search range to handle timezone differences (UTC vs Local)
    // +/- 1 day buffer ensures we capture all appointments for the user's local "day"
    const start = subDays(startOfDay(date), 1).toISOString()
    const end = addDays(endOfDay(date), 1).toISOString()

    // 1. Fetch Organization's Google Token
    const { data: org } = await supabase
        .from('organizations')
        .select('google_refresh_token')
        .eq('id', organizationId)
        .single()

    // 2. Fetch DB Appointments (Secure RPC)
    const dbPromise = supabase.rpc('get_busy_intervals', {
        p_organization_id: organizationId,
        p_start_time: start,
        p_end_time: end
    })

    // 3. Fetch Google Calendar Busy Slots (if connected)
    const googlePromise = org?.google_refresh_token
        ? getGoogleBusyIntervals(org.google_refresh_token, start, end)
        : Promise.resolve([])

    // Execute in parallel
    const [dbResult, googleBusy] = await Promise.all([dbPromise, googlePromise])

    const { data: rawAppointments, error } = dbResult

    if (error) {
        console.error('Error fetching busy intervals:', error)
        return []
    }

    // Cast the response to a known type
    const dbAppointments = (rawAppointments as { start_time: string, end_time: string }[] | null) || []

    // 4. Merge and Normalize
    const allBusy = [
        ...dbAppointments,
        ...googleBusy
    ]

    // Standardize dates
    return allBusy.map((a) => ({
        start_time: new Date(a.start_time).toISOString(),
        end_time: new Date(a.end_time).toISOString()
    }))
}

