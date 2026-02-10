import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
    console.error('Missing env vars!')
    process.exit(1)
}

async function debug() {
    const supabase = createClient(url, key)

    // Get org
    const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', 'ranu-a4a8')
        .single()

    console.log('Organization:', org?.name, org?.id)

    // Get slots
    const { data: slots, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('organization_id', org?.id)

    console.log('\nAvailability Slots:', slots?.length || 0)
    if (error) console.log('Error:', error)

    if (slots && slots.length > 0) {
        console.log('\nSlots by day:')
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        for (let i = 0; i <= 6; i++) {
            const daySlots = slots.filter(s => s.day_of_week === i)
            console.log(`${days[i]} (${i}):`, daySlots.length > 0 ? `${daySlots[0].start_time} - ${daySlots[0].end_time}` : 'NONE')
        }
    } else {
        console.log('\n⚠️  NO SLOTS FOUND - This is the problem!')
        console.log('Need to run the SQL INSERT to add slots.')
    }
}

debug().catch(console.error)
