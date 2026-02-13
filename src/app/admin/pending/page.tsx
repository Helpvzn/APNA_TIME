import { Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PendingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: org } = await supabase
            .from('organizations')
            .select('approval_status')
            .eq('user_id', user.id)
            .single()

        if (org?.approval_status === 'approved') {
            redirect('/admin')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 bg-white shadow rounded-lg px-4">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Account Pending Approval</h1>
            <p className="mt-2 text-center text-gray-600 max-w-md">
                Your organization details have been submitted. The platform owner is reviewing your request.
                You will be notified once your account is approved.
            </p>
            <div className="mt-6">
                <a href="/admin" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Check Status Again
                </a>
            </div>
        </div>
    )
}
