'use client'

import { useState, useEffect } from 'react'
import { Check, Copy, ExternalLink, Calendar, Clock, User, Mail, Trash2 } from 'lucide-react'
import { deleteAppointment, resetSchedule } from '../book/[slug]/actions'
import { format, isSameDay, startOfDay } from 'date-fns'

export default function DashboardClient({
    organization,
    appointments
}: {
    organization: any,
    appointments: any[]
}) {
    const [copied, setCopied] = useState(false)
    const [bookingUrl, setBookingUrl] = useState('')
    const [filterDate, setFilterDate] = useState<Date | null>(null)

    useEffect(() => {
        setBookingUrl(`${window.location.origin}/book/${organization.slug}`)
    }, [organization.slug])

    const handleCopy = () => {
        navigator.clipboard.writeText(bookingUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Filter appointments by selected date
    const filteredAppointments = filterDate
        ? appointments.filter(apt => isSameDay(new Date(apt.start_time), filterDate))
        : appointments;

    return (
        <div className="space-y-8">
            {/* Booking Link Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Booking Link</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 w-full relative">
                        <input
                            type="text"
                            readOnly
                            value={bookingUrl}
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-mono text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                        <a
                            href={bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all w-full sm:w-auto ${copied
                            ? 'bg-green-100 text-green-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-500/20'
                            }`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                            </>
                        )}
                    </button>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                    Share this link with your clients/patients to let them book appointments directly.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Total Appointments</dt>
                    <dd className="mt-2 text-3xl font-bold text-gray-900">{appointments.length}</dd>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Business Type</dt>
                    <dd className="mt-2 text-xl font-bold text-indigo-600 capitalize">{organization.business_type}</dd>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Status</dt>
                    <dd className="mt-2">
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 capitalize">
                            {organization.approval_status}
                        </span>
                    </dd>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Appointments</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={() => setFilterDate(null)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${!filterDate ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterDate(new Date())}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${filterDate && isSameDay(filterDate, new Date()) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                Today
                            </button>
                            <input
                                type="date"
                                onChange={(e) => setFilterDate(e.target.value ? new Date(e.target.value) : null)}
                                className="text-xs border-gray-200 rounded-lg px-2 py-1 bg-gray-50 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {appointments.length > 0 && (
                            <button
                                onClick={async () => {
                                    const confirmText = prompt('Type "DELETE" to confirm wiping ALL appointments. This cannot be undone.');
                                    if (confirmText === 'DELETE') {
                                        const result = await resetSchedule(organization.id)
                                        if (result.success) {
                                            alert('Schedule wiped clean.')
                                            window.location.reload()
                                        } else {
                                            alert('Failed to reset: ' + result.error)
                                        }
                                    }
                                }}
                                className="text-xs font-bold px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                            >
                                RESET ALL
                            </button>
                        )}
                        <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                            {appointments.length} Total
                        </span>
                    </div>
                </div>

                {filteredAppointments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAppointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                                    {apt.customer_name?.[0] || 'U'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{apt.customer_name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {apt.customer_email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {format(new Date(apt.start_time), 'MMM d, yyyy')}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {format(new Date(apt.start_time), 'h:mm a')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {Math.round((new Date(apt.end_time).getTime() - new Date(apt.start_time).getTime()) / 60000)} mins
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {apt.status || 'confirmed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to delete this appointment?')) {
                                                        const result = await deleteAppointment(apt.id, organization.id)
                                                        if (result?.success) {
                                                            window.location.reload()
                                                        } else {
                                                            alert('Failed to delete appointment')
                                                        }
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                                                title="Delete Appointment"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">No appointments yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Share your booking link to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
