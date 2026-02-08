import { Loader2 } from 'lucide-react'

export default function PendingPage() {
    return (
        <div className="flex flex-col items-center justify-center py-12 bg-white shadow rounded-lg px-4">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Account Pending Approval</h1>
            <p className="mt-2 text-center text-gray-600 max-w-md">
                Your organization details have been submitted. The platform owner is reviewing your request.
                You will be notified once your account is approved.
            </p>
        </div>
    )
}
