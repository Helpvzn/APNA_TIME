import { createClient } from '@/utils/supabase/server'
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function IntegrationsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('google_refresh_token, google_calendar_id')
        .eq('id', user?.id)
        .single()

    const isConnected = !!profile?.google_refresh_token

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Integrations</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Connect your Google Calendar to automatically sync appointments and prevent double bookings.
                            </p>

                            <div className="mt-4">
                                {isConnected ? (
                                    <div className="flex items-center text-green-700 bg-green-50 px-3 py-2 rounded-md w-fit">
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        <span>Connected</span>
                                    </div>
                                ) : (
                                    <Link
                                        href="/api/integrations/google/connect"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Connect Google Calendar
                                    </Link>
                                )}
                            </div>
                            {!isConnected && (
                                <div className="mt-2 text-xs text-amber-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    <span>Requires Google Cloud setup (Client ID/Secret)</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
