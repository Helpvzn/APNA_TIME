export default function BookingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                {children}
            </div>
        </div>
    )
}
