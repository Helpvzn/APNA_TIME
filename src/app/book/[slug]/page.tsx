import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import BookingClient from './BookingClient'
import { BusinessType, CATEGORY_CONFIG } from '@/lib/category-config'

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient()
    const { slug } = await params

    const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!org || org.approval_status !== 'approved') {
        notFound()
    }

    const businessType = org.business_type as BusinessType
    const config = CATEGORY_CONFIG[businessType]

    const { data: availabilitySlots, error: slotsError } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('organization_id', org.id)
        .eq('is_active', true)


    return (
        <main className="min-h-screen bg-white">
            <BookingClient org={org} config={config} availabilitySlots={availabilitySlots || []} />
        </main>
    )
}
