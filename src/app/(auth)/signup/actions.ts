'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const schema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    businessName: z.string().min(2, "Business name must be at least 2 characters"),
    businessType: z.enum(['doctor', 'hr', 'lawyer', 'consultant', 'service']),
})

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        businessName: formData.get('businessName'),
        businessType: formData.get('businessType'),
    }

    // Validate
    const result = schema.safeParse(data)
    if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || "Invalid input data";
        return { error: errorMessage }
    }

    const { error } = await supabase.auth.signUp({
        email: data.email as string,
        password: data.password as string,
        options: {
            data: {
                full_name: data.fullName,
                business_name: data.businessName,
                business_type: data.businessType,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true, message: 'Check your email to continue sign in process' }
}
