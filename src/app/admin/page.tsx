import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        console.error('Admin Load Error (Profile):', profileError)
        return <div className="p-8 text-black">Profile not found. Please sign up again. (Error: {profileError?.message})</div>
    }

    if (profile.role === 'super_admin') {
        redirect('/admin/super')
    }

    // Fetch Organization directly (more robust than join)
    const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user.id)
        .single() // Expecting one org per user

    if (orgError) console.error('Admin Load Error (Org):', orgError)

    if (!organization) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900">No Organization Found</h2>
                <p className="mt-2 text-gray-600">Please contact support or sign up again.</p>
                <div className="mt-4 text-xs text-gray-400">User ID: {user.id}</div>
            </div>
        )
    }

    if (organization.approval_status === 'pending') {
        redirect('/admin/pending')
    }

    if (organization.approval_status === 'rejected') {
        return (
            <div className="text-center py-12 flex flex-col items-center justify-center h-[50vh]">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-600">Your organization request has been rejected by the administrator.</p>
            </div>
        )
    }

    const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('organization_id', organization.id)
        .order('start_time', { ascending: false })

    // Approved Org Admin Dashboard
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="mt-2 text-lg text-gray-600">Welcome back, <span className="font-semibold text-indigo-600">{profile.full_name}</span></p>
            </div>

            <DashboardClient organization={organization} appointments={appointments || []} />
        </div>
    )
}
