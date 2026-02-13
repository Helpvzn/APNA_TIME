import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/admin'

    if (code) {
        const supabase = await createClient()

        // Exchange code for session
        const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code)

        if (authError || !user) {
            console.error('Auth error:', authError)
            return NextResponse.redirect(`${origin}/login?error=auth_failed`)
        }

        // Check if user entry exists in our users table
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        // If new user (first Google sign-in), create entry and organization
        if (!existingUser) {
            // Create user entry
            await supabase
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email!,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                })

            // Create organization with pending status
            const orgName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'My Organization'
            const slug = orgName.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
                + '-' + Math.random().toString(36).substr(2, 4)

            await supabase
                .from('organizations')
                .insert({
                    name: orgName,
                    slug,
                    user_id: user.id,
                    business_type: 'consultant', // Default - user can change later
                    approval_status: 'pending',
                })

            // Redirect new users to pending page
            return NextResponse.redirect(`${origin}/admin/pending`)
        }

        // Existing user - check approval status
        const { data: org } = await supabase
            .from('organizations')
            .select('approval_status')
            .eq('user_id', user.id)
            .single()

        if (org?.approval_status === 'pending') {
            return NextResponse.redirect(`${origin}/admin/pending`)
        }

        // Approved user - redirect to dashboard
        // Approved user - redirect to dashboard
        return NextResponse.redirect(new URL(next, request.url))
    }

    // No code provided
    return NextResponse.redirect(new URL('/login?error=auth_code_error', request.url))
}
