import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

export default async function IntegrationsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Next.js 15
}) {
    const supabase = await createClient()

    // 1. Get User & Org
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: org } = await supabase
        .from('organizations')
        .select('google_connected_email, google_updated_at')
        .eq('user_id', user.id)
        .single()

    // Resolve searchParams before using
    const params = await searchParams
    const success = params?.success
    const error = params?.error

    const isConnected = !!org?.google_connected_email

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Integrations</h1>

            {/* Notifications */}
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Google Calendar connected successfully!
                </div>
            )}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 animate-in fade-in slide-in-from-top-4">
                    <XCircle className="w-5 h-5 mr-3" />
                    Failed to connect. Please try again.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Google Calendar Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Google Calendar</h3>
                                    <p className="text-sm text-gray-500">Sync appointments & busy slots</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                {isConnected ? 'Active' : 'Disconnected'}
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-6">
                            Connect your Google Calendar to automatically block busy times and add new appointments to your personal schedule.
                        </p>

                        {isConnected ? (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-600 mb-1">Connected Account</p>
                                <p className="font-medium text-gray-900 flex items-center">
                                    {org.google_connected_email}
                                    <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                </p>
                            </div>
                        ) : (
                            <div className="bg-blue-50/50 rounded-lg p-4 mb-6 border border-blue-100">
                                <ul className="text-sm text-blue-800 space-y-2">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Prevents double-booking
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Adds appointments to your phone
                                    </li>
                                </ul>
                            </div>
                        )}

                        <div className="border-t pt-6">
                            {isConnected ? (
                                <form action="/api/integrations/google/disconnect" method="POST">
                                    <button className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        Disconnect Calendar
                                    </button>
                                </form>
                            ) : (
                                <a
                                    href="/api/integrations/google/auth"
                                    className="block w-full text-center py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors relative group overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center">
                                        <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4 mr-2 opacity-70" />
                                        Connect Google Calendar
                                    </span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
