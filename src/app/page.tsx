import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col">
        <h1 className="text-5xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          ApnaTime SaaS
        </h1>
        <p className="text-xl text-slate-400 mb-12 text-center max-w-2xl">
          The ultimate appointment booking platform for professionals.
          Manage your schedule effortlessly as a Doctor, Lawyer, Consultant, or Service Provider.
        </p>

        <div className="flex gap-6">
          <Link href="/login" className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25">
            Login to Dashboard
          </Link>
          <Link href="/signup" className="px-8 py-4 bg-transparent text-white font-semibold border border-slate-700 rounded-lg hover:bg-slate-800 transition-all">
            Create Account
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-slate-400">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-2">For Doctors</h3>
            <p className="text-sm">Patient scheduling & clinic management.</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-2">For Consultants</h3>
            <p className="text-sm">Client meetings & consultation slots.</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-2">For Service Providers</h3>
            <p className="text-sm">Service bookings & resource management.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
