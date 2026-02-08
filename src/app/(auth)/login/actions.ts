'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
})

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const result = schema.safeParse(data)
    if (!result.success) {
        return { error: 'Invalid credentials' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email: data.email as string,
        password: data.password as string,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/admin')
}
