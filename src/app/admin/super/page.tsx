import { createClient } from '@/utils/supabase/server'
import { approveOrganization, rejectOrganization } from './actions'
import { Check, X } from 'lucide-react'

export default async function SuperAdminDashboard() {
    const supabase = await createClient()
    const { data: orgs } = await supabase
        .from('organizations')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Platform Overview</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Pending Organization Requests
                    </h3>
                </div>
                <ul role="list" className="divide-y divide-gray-200">
                    {orgs?.map((org) => (
                        <li key={org.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <p className="text-sm font-semibold text-indigo-600">{org.name}</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 capitalize">
                                        {org.business_type}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Slug: {org.slug}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <form action={approveOrganization.bind(null, org.id)}>
                                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                        <Check className="h-4 w-4 mr-1" /> Approve
                                    </button>
                                </form>
                                <form action={rejectOrganization.bind(null, org.id)}>
                                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                        <X className="h-4 w-4 mr-1 text-red-500" /> Reject
                                    </button>
                                </form>
                            </div>
                        </li>
                    ))}
                    {orgs?.length === 0 && (
                        <li className="px-6 py-12 text-center text-gray-500">
                            No pending requests at the moment.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}
