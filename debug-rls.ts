
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Might not be available in local env if not set

console.log('Testing RLS policies...')

async function check() {
    // 1. Client as Anonymous User (Public)
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

    // 2. Fetch Organization
    const slug = 'ranu-a4a8'
    const { data: org, error: orgError } = await supabaseAnon
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single()

    if (orgError) {
        console.error('Error fetching org:', orgError)
        return
    }
    console.log(`Found Organization: ${org.name} (${org.id})`)

    // 3. Fetch Availability Slots as Anonymous
    const { data: slotsBox, error: slotsError } = await supabaseAnon
        .from('availability_slots')
        .select('*')
        .eq('organization_id', org.id)

    console.log(`Anonymous fetch availability_slots count: ${slotsBox?.length}`)
    if (slotsError) console.error('Error fetching slots:', slotsError)

    // 4. Inspect data (if needed, but without service key we can't bypass RLS unless policy allows)
    // If Anon key returns 0, and we suspect data exists, we need to fix policy.

    if (slotsBox?.length === 0) {
        console.log('WARNING: No slots returned for anonymous user. Likely RLS issue if data exists.')
    } else {
        console.log('Success: Slots returned:', slotsBox)
    }
}

check()
