import { createClient } from './src/utils/supabase/server'
import { getAppointmentsForDate } from './src/app/book/[slug]/queries'

async function test() {
    const orgId = '806a453b-1156-4a0e-8458-390315d236f7'
    const testDate = new Date('2026-02-09T00:00:00') // Local 00:00

    console.log('Testing with date:', testDate.toISOString())
    const appts = await getAppointmentsForDate(orgId, testDate)
    console.log('Found appts:', JSON.stringify(appts, null, 2))
}

test()
