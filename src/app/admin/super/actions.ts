'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function approveOrganization(orgId: string) {
    const supabase = await createClient()

    // Verify super admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'super_admin') return

    await supabase.from('organizations').update({ approval_status: 'approved' }).eq('id', orgId)
    revalidatePath('/admin/super')
}

export async function rejectOrganization(orgId: string) {
    const supabase = await createClient()

    // Verify super admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'super_admin') return

    await supabase.from('organizations').update({ approval_status: 'rejected' }).eq('id', orgId)
    revalidatePath('/admin/super')
}
