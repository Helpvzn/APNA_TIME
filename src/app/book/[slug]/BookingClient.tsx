'use client'

import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format, isSameDay, parse, addMinutes, isBefore, isAfter, isEqual } from 'date-fns'
import { CategoryConfig } from '@/lib/category-config'
import { Loader2, Calendar as CalendarIcon, Clock, ChevronLeft } from 'lucide-react'
import { bookAppointment } from './actions'
import { getAppointmentsForDate } from './queries'
import { createClient } from '@/utils/supabase/client'

interface Appointment {
    id: string;
    start_time: string;
    end_time: string;
    status: string;
}

interface AvailabilitySlot {
    day_of_week: number;
    start_time: string;
    end_time: string;
}

interface BookingClientProps {
    org: any;
    config: CategoryConfig;
    availabilitySlots: AvailabilitySlot[];
}

export default function BookingClient({ org, config, availabilitySlots }: BookingClientProps) {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [availableSlots, setAvailableSlots] = useState<{ time: string; isBooked: boolean }[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)

    // Fetch slots when date changes
    useEffect(() => {
        if (!date) return;

        const fetchSlots = async () => {
            setIsLoadingSlots(true)
            try {
                // 1. Get working hours for this day
                const dayOfWeek = date.getDay()
                console.log('🔍 Selected date:', date)
                console.log('🔍 Day of week (JS):', dayOfWeek) // 0=Sunday, 3=Wednesday
                console.log('🔍 All availability slots:', availabilitySlots)

                const daySlots = availabilitySlots.filter(s => s.day_of_week === dayOfWeek)
                console.log('🔍 Filtered day slots:', daySlots)

                if (daySlots.length === 0) {
                    setAvailableSlots([])
                    return
                }

                // 2. Fetch existing appointments to check conflicts
                const existingAppts = await getAppointmentsForDate(org.id, date)
                console.log('DEBUG: Fetched Appointments:', existingAppts)

                // 3. Generate slots
                const generated: { time: string; isBooked: boolean }[] = []
                const duration = config.slotDuration

                daySlots.forEach(slot => {
                    // Parse start/end times (HH:MM:SS)
                    const [startH, startM] = slot.start_time.split(':').map(Number)
                    const [endH, endM] = slot.end_time.split(':').map(Number)

                    let current = new Date(date)
                    current.setHours(startH, startM, 0, 0)

                    const end = new Date(date)
                    end.setHours(endH, endM, 0, 0)

                    while (isBefore(current, end)) {
                        const slotEnd = addMinutes(current, duration)
                        if (isAfter(slotEnd, end)) break;

                        // Check collision
                        const isOccupied = existingAppts.some(appt => {
                            const slotStartMs = current.getTime()
                            const slotEndMs = slotEnd.getTime()
                            const apptStartMs = new Date(appt.start_time).getTime()
                            const apptEndMs = new Date(appt.end_time).getTime()

                            // Check collision with 1 second tolerance for millisecond drift
                            const isExactMatch = Math.abs(slotStartMs - apptStartMs) < 1000
                            const isOverlapping = slotStartMs < apptEndMs && slotEndMs > apptStartMs

                            return isExactMatch || isOverlapping
                        })

                        generated.push({
                            time: format(current, 'HH:mm'),
                            isBooked: isOccupied
                        })

                        current = addMinutes(current, duration)
                    }
                })

                setAvailableSlots(generated.sort((a, b) => a.time.localeCompare(b.time)))
            } finally {
                setIsLoadingSlots(false)
            }
        }

        fetchSlots()

        // 4. REALTIME: Listen for new bookings
        const supabase = createClient()
        const channel = supabase
            .channel('appointments_realtime')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen for all changes (Insert/Delete)
                    schema: 'public',
                    table: 'appointments',
                    filter: `organization_id=eq.${org.id}`
                },
                (payload) => {
                    console.log('REALTIME: Appointment Change Detected:', payload)
                    fetchSlots() // Refresh UI on any change
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [date, availabilitySlots, config.slotDuration, org.id])

    const handleDateSelect = (day: Date | undefined) => {
        setDate(day)
        setSelectedSlot(null) // Clear stale selection
        setError(null) // Clear stale errors
        if (day) setStep(2)
    }

    const handleSlotSelect = async (slot: string) => {
        setError(null) // Clear stale errors
        // Double Check: Ensure it wasn't JUST booked (Realtime should catch it but extra safety)
        const isStillAvailable = availableSlots.find(s => s.time === slot && !s.isBooked)
        if (!isStillAvailable) {
            setError('This slot was just taken. Please select another.')
            return
        }
        setSelectedSlot(slot)
        setStep(3)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        formData.append('organizationId', org.id)
        formData.append('date', date!.toISOString())
        formData.append('time', selectedSlot!)
        formData.append('slug', org.slug) // For redirect

        // Construct absolute timestamp based on user's local selection
        const [h, m] = selectedSlot!.split(':').map(Number)
        const combined = new Date(date!)
        combined.setHours(h, m, 0, 0)
        formData.append('isoDateTime', combined.toISOString())

        try {
            const result = await bookAppointment(formData)
            if (result?.error) {
                setError(result.error)
                setIsSubmitting(false)
            }
        } catch (e) {
            setError('Something went wrong. Please try again.')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 w-full overflow-x-hidden">
            {/* Sidebar: Org Info - Fixed Width on Desktop */}
            <div className="lg:w-80 bg-slate-900 text-white p-6 lg:p-8 flex flex-col justify-between shrink-0 transition-all">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                            <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold tracking-tight leading-tight truncate">{org.name}</h2>
                            <p className="text-slate-400 font-medium uppercase tracking-wider text-xs truncate">{config.label}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="relative pl-4 border-l-2 border-slate-700">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Selected Date</p>
                            <p className="font-medium text-xl text-white break-words">
                                {date ? format(date, 'EEEE, MMM d') : 'Select a Date'}
                            </p>
                            {date && <p className="text-sm text-slate-400">{format(date, 'yyyy')}</p>}
                        </div>

                        {selectedSlot && (
                            <div className="relative pl-4 border-l-2 border-indigo-500">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Selected Time</p>
                                <p className="font-medium text-xl text-white">{selectedSlot}</p>
                                <p className="text-sm text-slate-400">{config.slotDuration} Minutes</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800">
                    <p className="text-xs text-slate-500">Powered by ApnaTime SaaS</p>
                </div>
            </div>

            {/* Main Content - Fluid Width */}
            <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-white min-w-0">
                <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
                    {/* Header Steps */}
                    <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {step === 1 ? 'Select Date' : step === 2 ? 'Select Time Slot' : 'Finalize Booking'}
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">
                                {step === 1 ? 'Choose a day for your appointment' : step === 2 ? `Available slots for ${date ? format(date, 'MMM d') : ''}` : 'Enter your details to confirm'}
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <span className={`h-2.5 w-10 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                            <span className={`h-2.5 w-10 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                            <span className={`h-2.5 w-10 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        </div>
                    </div>

                    {/* STEP 1: CALENDAR ONLY */}
                    {step === 1 && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-50 duration-300">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <style jsx global>{`
                                    .rdp { --rdp-cell-size: 50px; --rdp-accent-color: #4f46e5; margin: 0; }
                                    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #f3f4f6; }
                                    .rdp-day_selected { font-weight: bold; color: white; background-color: #4f46e5; }
                                    .rdp-day_selected:hover { background-color: #4338ca; }
                                    .rdp-caption_label { color: #111827; font-weight: 700; font-size: 1.2rem; margin-bottom: 1rem; }
                                    .rdp-head_cell { color: #6b7280; font-weight: 600; font-size: 0.9rem; text-transform: uppercase; padding-bottom: 0.5rem; }
                                    .rdp-day { color: #1f2937; font-weight: 500; font-size: 1.1rem; }
                                `}</style>
                                <DayPicker
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateSelect}
                                    disabled={{ before: new Date() }}
                                />
                            </div>
                            <p className="mt-8 text-gray-500 text-sm">Select a date to view available time slots</p>
                        </div>
                    )}

                    {/* STEP 2: SLOTS ONLY */}
                    {step === 2 && (
                        <div className="flex-1 w-full animate-in slide-in-from-right-8 duration-300">
                            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Calendar
                                </button>

                                {/* Cinema Legend */}
                                <div className="flex items-center gap-3 text-xs font-medium text-gray-600 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-sm border border-gray-300 bg-white"></div>
                                        <span>Available</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200"></div>
                                        <span>Booked</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-sm bg-indigo-600 border border-indigo-600"></div>
                                        <span>Selected</span>
                                    </div>
                                </div>
                            </div>

                            {isLoadingSlots ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                                    <p className="text-gray-500">Loading availability...</p>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                                    {availableSlots.map(({ time, isBooked }) => (
                                        <button
                                            key={time}
                                            onClick={() => !isBooked && handleSlotSelect(time)}
                                            disabled={isBooked}
                                            className={`
                                                relative py-4 px-2 rounded-lg text-sm font-bold transition-all duration-200 border-2
                                                flex flex-col items-center justify-center gap-1
                                                ${isBooked
                                                    ? 'bg-red-600 border-red-700 text-white cursor-not-allowed shadow-inner'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md hover:-translate-y-1'
                                                }
                                                ${!isBooked && 'active:scale-95'}
                                                ${selectedSlot === time ? '!border-indigo-600 !bg-indigo-50 !text-indigo-700 ring-4 ring-indigo-500/20 z-10' : ''}
                                            `}
                                        >
                                            <span className="text-base tracking-tight">{time}</span>
                                            {isBooked ? (
                                                <span className="text-[10px] uppercase font-black text-red-100 tracking-wider">SOLD</span>
                                            ) : (
                                                <span className={`text-[10px] font-medium ${selectedSlot === time ? 'text-indigo-500' : 'text-green-500'}`}>OPEN</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">No slots available</h3>
                                    <p className="text-gray-500 mt-1">Please try selecting a different date.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: FORM ONLY */}
                    {step === 3 && (
                        <div className="max-w-2xl mx-auto w-full animate-in zoom-in-50 duration-300">
                            <button
                                onClick={() => setStep(2)}
                                className="mb-8 text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Slots
                            </button>

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900">Finalize Booking</h3>
                                <p className="mt-2 text-gray-500">Please enter your details to confirm the appointment.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-1">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            id="customerName"
                                            required
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 bg-gray-50 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="customerEmail"
                                            id="customerEmail"
                                            required
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 bg-gray-50 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    {/* Dynamic Fields */}
                                    {config.fields.map((field) => (
                                        <div key={field.name}>
                                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    name={field.name}
                                                    id={field.name}
                                                    required={field.required}
                                                    rows={3}
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 bg-gray-50 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                                                />
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    id={field.name}
                                                    required={field.required}
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4 bg-gray-50 focus:bg-white transition-colors text-gray-900 placeholder-gray-500"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {error && (
                                    <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                                <div className="mt-2 text-sm text-red-700">
                                                    <p>{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : 'Confirm Booking'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
