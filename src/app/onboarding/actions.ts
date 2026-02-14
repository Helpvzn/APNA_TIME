'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createOrganization(formData: FormData) {
    const supabase = await createClient()

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Validate Inputs
    const businessName = formData.get('businessName') as string
    const businessType = formData.get('businessType') as string

    if (!businessName || !businessType) {
        return { error: 'Please fill in all fields.' }
    }

    // 3. Generate Slug
    const randomSuffix = Math.random().toString(36).substring(2, 7)
    const slug = `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomSuffix}`

    // 4. Insert Organization
    const { error } = await supabase.from('organizations').insert({
        user_id: user.id,
        name: businessName,
        business_type: businessType, // 'doctor', 'barber', etc.
        slug: slug,
        approval_status: 'pending' // STRICTLY PENDING
    })

    if (error) {
        console.error('Onboarding Error:', error)
        return { error: 'Failed to create organization. Please try again.' }
    }

    // 5. Revalidate and Redirect
    revalidatePath('/admin')
    redirect('/admin')
}
