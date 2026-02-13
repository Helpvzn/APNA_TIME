'use client'

import { useActionState } from 'react'
import { signup } from './actions'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

const initialState = {
    message: '',
    error: '',
    success: false
}

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signup, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#150305] px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="bg-wine-card p-8 rounded-2xl border border-wine-gold/20 shadow-xl shadow-wine-gold/10">
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        Start your SaaS journey
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Create your admin account to manage appointments
                    </p>
                </div>

                {/* Google Sign-In Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={async () => {
                            const { signInWithGoogle } = await import('./google-auth')
                            await signInWithGoogle()
                        }}
                        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-wine-card px-2 text-gray-400">Or continue with email</span>
                    </div>
                </div>

                {state?.success ? (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Registration successful</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>{state.message}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form action={formAction} className="mt-8 space-y-6">
                        {state?.error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                {state.error}
                            </div>
                        )}
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div>
                                <label htmlFor="fullName" className="sr-only">Full Name</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-wine-gold/30 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-wine-gold sm:text-sm sm:leading-6 pl-3"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-wine-gold/30 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-wine-gold sm:text-sm sm:leading-6 pl-3"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-wine-gold/30 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-wine-gold sm:text-sm sm:leading-6 pl-3"
                                    placeholder="Password"
                                />
                            </div>
                            <div>
                                <label htmlFor="businessName" className="sr-only">Business Name</label>
                                <input
                                    id="businessName"
                                    name="businessName"
                                    type="text"
                                    required
                                    className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-wine-gold/30 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-wine-gold sm:text-sm sm:leading-6 pl-3"
                                    placeholder="Business Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="businessType" className="sr-only">Business Type</label>
                                <select
                                    id="businessType"
                                    name="businessType"
                                    required
                                    className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-wine-gold/30 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-wine-gold sm:text-sm sm:leading-6 pl-3"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Business Type</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="hr">HR / Company</option>
                                    <option value="lawyer">Lawyer</option>
                                    <option value="consultant">Consultant / Coach</option>
                                    <option value="service">Service Provider</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="group relative flex w-full justify-center rounded-md bg-wine-gradient px-3 py-2 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine-gold disabled:opacity-70"
                            >
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Sign up
                            </button>
                        </div>
                        <div className="text-sm text-center">
                            <Link href="/login" className="font-medium text-wine-gold hover:text-wine-gold-light">
                                Already have an account? Log in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}




