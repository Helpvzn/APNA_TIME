import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', user.id)
        .single()

    if (!profile) return <div>Profile not found</div>

    if (profile.role === 'super_admin') {
        redirect('/admin/super')
    }

    // Handle case where organizations might be an array or single object depending on query
    const organization = Array.isArray(profile.organizations) ? profile.organizations[0] : profile.organizations;

    if (!organization) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900">No Organization Found</h2>
                <p className="mt-2 text-gray-600">Please contact support or sign up again.</p>
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
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
                    <p className="text-sm text-red-800">Please contact support for more information.</p>
                </div>
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
