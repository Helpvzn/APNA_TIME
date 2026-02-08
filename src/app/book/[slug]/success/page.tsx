import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function BookingSuccessPage({ params }: { params: { slug: string } }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 text-center">Booking Confirmed!</h1>
            <p className="mt-2 text-gray-600 text-center max-w-md">
                Your appointment has been successfully scheduled. A confirmation email has been sent to you.
            </p>
            <div className="mt-8">
                <Link
                    href={`/book/${params.slug}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Book Another Appointment
                </Link>
            </div>
        </div>
    )
}
