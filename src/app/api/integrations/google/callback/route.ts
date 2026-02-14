import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    if (error || !code) {
        return NextResponse.redirect(`${url.origin}/admin/integrations?error=access_denied`)
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.redirect(`${url.origin}/login`)
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${url.origin}/api/integrations/google/callback`
        )

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens)

        // Get User Email to display in UI
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
        const { data: userInfo } = await oauth2.userinfo.get()

        // SAVE TO DB
        // Note: For production, encrypt 'refresh_token'. MVP stores plain text.
        // We only care about refresh_token. Access token expires in 1h.
        const { error: updateError } = await supabase
            .from('organizations')
            .update({
                google_refresh_token: tokens.refresh_token, // Can be null if prompt!='consent'
                google_connected_email: userInfo.email,
                google_updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)

        if (updateError) throw updateError

        return NextResponse.redirect(`${url.origin}/admin/integrations?success=true`)

    } catch (err) {
        console.error('OAuth Error:', err)
        return NextResponse.redirect(`${url.origin}/admin/integrations?error=token_exchange_failed`)
    }
}
