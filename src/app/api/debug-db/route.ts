import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // Get org
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', 'ranu-a4a8')
        .single()

    if (orgError || !org) {
        return NextResponse.json({ error: 'Org not found', details: orgError }, { status: 404 })
    }

    // Get slots
    const { data: slots, error: slotsError } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('organization_id', org.id)

    return NextResponse.json({
        organization: {
            id: org.id,
            name: org.name,
            slug: org.slug
        },
        slots: {
            count: slots?.length || 0,
            error: slotsError,
            data: slots
        }
    })
}
