import Link from 'next/link'
import { Calendar, Users, Sparkles, Heart, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-romantic-darker">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-romantic-gradient opacity-10"></div>

        {/* Floating hearts decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-romantic-pink/20 animate-float">
            <Heart className="w-8 h-8 md:w-12 md:h-12" fill="currentColor" />
          </div>
          <div className="absolute top-40 right-20 text-romantic-purple/20 animate-float" style={{ animationDelay: '1s' }}>
            <Heart className="w-6 h-6 md:w-10 md:h-10" fill="currentColor" />
          </div>
          <div className="absolute bottom-40 left-1/4 text-romantic-pink-light/20 animate-float" style={{ animationDelay: '2s' }}>
            <Heart className="w-5 h-5 md:w-8 md:h-8" fill="currentColor" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-romantic-gradient mb-6 sm:mb-8 animate-heartbeat">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6">
              <span className="block text-white">ApnaTime</span>
              <span className="block text-transparent bg-clip-text bg-romantic-gradient">
                SaaS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-4">
              The ultimate appointment booking platform for professionals.
              <span className="block mt-2 text-romantic-pink-light">
                Manage your schedule effortlessly.
              </span>
            </p>

            {/* CTA Buttons - Stacked on mobile, side by side on tablet+ */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <Link
                href="/login"
                className="group w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-romantic-gradient text-white font-bold text-base sm:text-lg rounded-xl hover:scale-105 transition-all shadow-lg shadow-romantic-pink/25 hover:shadow-romantic-pink/40 flex items-center justify-center gap-2"
              >
                Login to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/signup"
                className="group w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-romantic-card text-white font-bold text-base sm:text-lg border-2 border-romantic-pink/30 rounded-xl hover:border-romantic-pink hover:bg-romantic-dark transition-all flex items-center justify-center gap-2"
              >
                Create Account
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-romantic-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
            <span className="text-white">Perfect for </span>
            <span className="text-transparent bg-clip-text bg-romantic-gradient">Every Professional</span>
          </h2>

          {/* Feature Cards - Stacked on mobile, 2 cols on tablet, 3 cols on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Doctor Card */}
            <div className="group p-6 sm:p-8 bg-romantic-card/50 backdrop-blur-sm rounded-2xl border border-romantic-pink/20 hover:border-romantic-pink/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-romantic-pink/10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-romantic-pink/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-romantic-pink/30 transition-colors">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-romantic-pink" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">For Doctors</h3>
              <p className="text-sm sm:text-base text-gray-400">Patient scheduling & clinic management made simple.</p>
            </div>

            {/* Consultant Card */}
            <div className="group p-6 sm:p-8 bg-romantic-card/50 backdrop-blur-sm rounded-2xl border border-romantic-purple/20 hover:border-romantic-purple/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-romantic-purple/10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-romantic-purple/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-romantic-purple/30 transition-colors">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-romantic-purple" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">For Consultants</h3>
              <p className="text-sm sm:text-base text-gray-400">Client meetings & consultation slots organized perfectly.</p>
            </div>

            {/* Service Provider Card */}
            <div className="group p-6 sm:p-8 bg-romantic-card/50 backdrop-blur-sm rounded-2xl border border-romantic-pink-light/20 hover:border-romantic-pink-light/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-romantic-pink-light/10 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-romantic-pink-light/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-romantic-pink-light/30 transition-colors">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-romantic-pink-light" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">For Service Providers</h3>
              <p className="text-sm sm:text-base text-gray-400">Service bookings & resource management at your fingertips.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-romantic-darker border-t border-romantic-pink/10 py-6 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm sm:text-base">
            © 2026 ApnaTime SaaS. Made with{' '}
            <Heart className="inline w-4 h-4 text-romantic-pink fill-romantic-pink animate-heartbeat" />{' '}
            for professionals.
          </p>
        </div>
      </footer>
    </main>
  )
}
