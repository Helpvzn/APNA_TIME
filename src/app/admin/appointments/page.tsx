import { createClient } from '@/utils/supabase/server'
import { CATEGORY_CONFIG, BusinessType } from '@/lib/category-config'
import { Calendar, Clock, User } from 'lucide-react'

export default async function AppointmentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Fetch profile and organization to get business type
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', user.id)
        .single()

    const businessType = profile?.organizations?.business_type as BusinessType
    const config = CATEGORY_CONFIG[businessType] || CATEGORY_CONFIG.doctor // fallback

    const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('organization_id', profile?.organization_id)
        .order('start_time', { ascending: true })

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Upcoming {config.label}
                    </h2>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {appointments?.map((appt) => (
                        <li key={appt.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-sm font-medium text-indigo-600">{appt.customer_name}</p>
                                    <div className="ml-2 flex flex-shrink-0">
                                        <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                            {appt.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            <User className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            {appt.customer_email}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <Calendar className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <p>
                                            {new Date(appt.start_time).toLocaleDateString()}
                                        </p>
                                        <Clock className="ml-4 mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        <p>
                                            {new Date(appt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                {/* Category specific details */}
                                <div className="mt-2 text-sm text-gray-500">
                                    {/* Display dynamic fields if stored in metadata */}
                                    {Object.entries(appt.metadata || {}).map(([key, value]) => (
                                        <div key={key} className="flex gap-1">
                                            <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                                            <span>{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                    {(!appointments || appointments.length === 0) && (
                        <li className="px-4 py-8 text-center text-gray-500">
                            No upcoming {config.label.toLowerCase()}.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}
