import { NextResponse } from 'next/server'
import { oauth2Client } from '@/lib/google-calendar'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.redirect(`${origin}/admin/integrations?error=NoCode`)
    }

    try {
        const { tokens } = await oauth2Client.getToken(code)

        if (!tokens.refresh_token) {
            // If user already authorized, we might not get refresh token unless prompt='consent'
            console.warn('No refresh token returned')
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user && tokens.refresh_token) {
            await supabase.from('profiles').update({
                google_refresh_token: tokens.refresh_token
            }).eq('id', user.id)
        }

        return NextResponse.redirect(`${origin}/admin/integrations?success=true`)
    } catch (error) {
        console.error('Error exchanging code', error)
        return NextResponse.redirect(`${origin}/admin/integrations?error=ExchangeFailed`)
    }
}
