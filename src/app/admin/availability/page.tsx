import { createClient } from '@/utils/supabase/server'
import { addSlot, deleteSlot } from './actions'
import { Trash2, Plus } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default async function AvailabilityPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user?.id).single()

    const { data: slots } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('organization_id', profile?.organization_id)
        .order('day_of_week')
        .order('start_time')

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Manage Availability</h1>

            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-lg font-medium mb-4">Add New Slot</h2>
                <form action={addSlot} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Day</label>
                        <select name="dayOfWeek" className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2">
                            {DAYS.map((day, index) => (
                                <option key={day} value={index}>{day}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input type="time" name="startTime" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <input type="time" name="endTime" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 mb-[2px]">
                        <Plus className="h-5 w-5" />
                    </button>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {slots?.map((slot) => (
                        <li key={slot.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                            <div className="flex gap-4">
                                <span className="font-medium text-gray-900 w-24">{DAYS[slot.day_of_week]}</span>
                                <span className="text-gray-500">{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</span>
                            </div>
                            <form action={deleteSlot.bind(null, slot.id)}>
                                <button className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </form>
                        </li>
                    ))}
                    {slots?.length === 0 && (
                        <li className="p-8 text-center text-gray-500">No availability slots configured.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
