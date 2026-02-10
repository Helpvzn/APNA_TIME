// Simple diagnostic - paste this in browser console on the booking page

fetch('http://localhost:3000/api/debug-slots')
    .then(r => r.json())
    .then(console.log)
    .catch(console.error)

// Or directly test the Supabase query
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    'YOUR_SUPABASE_URL',
    'YOUR_ANON_KEY'
)

// Test 1: Can we see the org?
supabase
    .from('organizations')
    .select('*')
    .eq('slug', 'ranu-a4a8')
    .single()
    .then(r => console.log('Org:', r))

// Test 2: Can we see slots for this org?
supabase
    .from('organizations')
    .select('*')
    .eq('slug', 'ranu-a4a8')
    .single()
    .then(({ data: org }) => {
        return supabase
            .from('availability_slots')
            .select('*')
            .eq('organization_id', org.id)
            .eq('is_active', true)
    })
    .then(r => console.log('Slots:', r))
