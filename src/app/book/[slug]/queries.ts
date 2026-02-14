import { createClient } from '@/utils/supabase/server'
import { startOfDay, endOfDay, subDays, addDays } from 'date-fns'

export async function getAppointmentsForDate(organizationId: string, date: Date) {
    const supabase = await createClient()

    // Widen the search range to handle timezone differences (UTC vs Local)
    // +/- 1 day buffer ensures we capture all appointments for the user's local "day"
    const start = subDays(startOfDay(date), 1).toISOString()
    const end = addDays(endOfDay(date), 1).toISOString()

    // Use RPC to securely fetch busy slots without exposing user data (Bypassing RLS via Security Definier)
    const { data: appointments, error } = await supabase.rpc('get_busy_intervals', {
        p_organization_id: organizationId,
        p_start_time: start,
        p_end_time: end
    })

    if (error) {
        console.error('Error fetching busy intervals:', error)
        return []
    }

    // Standardize dates to ISO strings for consistent browser parsing
    return (appointments || []).map(a => ({
        ...a,
        start_time: new Date(a.start_time).toISOString(),
        end_time: new Date(a.end_time).toISOString()
    }))
}
