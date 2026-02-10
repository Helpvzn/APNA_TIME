import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('=== DEBUGGING SLOT AVAILABILITY ===\n')

async function checkSlots() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // 1. Find the organization
    const slug = 'ranu-a4a8'
    console.log(`1. Fetching organization: ${slug}`)

    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single()

    if (orgError) {
        console.error('❌ Error fetching organization:', orgError)
        return
    }

    console.log(`✅ Found: ${org.name} (ID: ${org.id})`)
    console.log(`   Business Type: ${org.business_type}`)
    console.log(`   Approval Status: ${org.approval_status}\n`)

    // 2. Check availability_slots
    console.log('2. Fetching availability_slots...')

    const { data: slots, error: slotsError } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('organization_id', org.id)
        .eq('is_active', true)

    if (slotsError) {
        console.error('❌ Error fetching slots:', slotsError)
        return
    }

    console.log(`✅ Found ${slots?.length || 0} availability slots`)

    if (!slots || slots.length === 0) {
        console.log('⚠️  NO SLOTS FOUND! This is the problem.')
        console.log('   The organization has no availability_slots configured.')
        console.log('   We need to add default 24/7 slots.\n')
        return { org, hasSlots: false }
    }

    // 3. Display slots by day
    console.log('\n3. Availability by day:')
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    for (let day = 0; day <= 6; day++) {
        const daySlots = slots.filter(s => s.day_of_week === day)
        if (daySlots.length > 0) {
            console.log(`   ${days[day]}:`)
            daySlots.forEach(s => {
                console.log(`      - ${s.start_time} to ${s.end_time}`)
            })
        } else {
            console.log(`   ${days[day]}: ❌ No slots`)
        }
    }

    // 4. Check specific date (Feb 10, 2026 = Tuesday)
    const testDate = new Date('2026-02-10')
    const dayOfWeek = testDate.getDay()
    console.log(`\n4. Checking slots for ${testDate.toDateString()} (${days[dayOfWeek]}):`)

    const todaySlots = slots.filter(s => s.day_of_week === dayOfWeek)
    if (todaySlots.length > 0) {
        console.log(`   ✅ ${todaySlots.length} slot(s) available`)
    } else {
        console.log(`   ❌ NO SLOTS for ${days[dayOfWeek]}`)
    }

    return { org, hasSlots: true, slots }
}

checkSlots()
