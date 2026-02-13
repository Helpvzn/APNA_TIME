'use server'

import { createAdminClient } from '@/utils/supabase/server'
import { startOfDay, endOfDay, subDays, addDays } from 'date-fns'

export async function getAppointmentsForDate(organizationId: string, date: Date) {
    // USE ADMIN CLIENT (Service Role) TO BYPASS RLS
    // This is safe because we ONLY return start/end times, not personal data.
    const supabase = await createAdminClient()

    // Widen the search range to handle timezone differences (UTC vs Local)
    // +/- 1 day buffer ensures we capture all appointments for the user's local "day"
    const start = subDays(startOfDay(date), 1).toISOString()
    const end = addDays(endOfDay(date), 1).toISOString()

    const { data: appointments } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('organization_id', organizationId)
        .gte('start_time', start)
        .lte('start_time', end)
        .neq('status', 'cancelled')

    // Standardize dates to ISO strings for consistent browser parsing
    return (appointments || []).map(a => ({
        ...a,
        start_time: new Date(a.start_time).toISOString(),
        end_time: new Date(a.end_time).toISOString()
    }))
}
