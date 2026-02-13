'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSlot(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) return

    const dayOfWeek = parseInt(formData.get('dayOfWeek') as string)
    const startTime = formData.get('startTime') as string
    const endTime = formData.get('endTime') as string

    await supabase.from('availability_slots').insert({
        organization_id: profile.organization_id,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        is_available: true
    })

    revalidatePath('/admin/availability')
}

export async function deleteSlot(slotId: string) {
    const supabase = await createClient()
    await supabase.from('availability_slots').delete().eq('id', slotId)
    revalidatePath('/admin/availability')
}
