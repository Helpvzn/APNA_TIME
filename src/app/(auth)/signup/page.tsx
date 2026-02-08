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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Start your SaaS journey
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create your admin account to manage appointments
                    </p>
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
                                    className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
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
                                    className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
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
                                    className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
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
                                    className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                                    placeholder="Business Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="businessType" className="sr-only">Business Type</label>
                                <select
                                    id="businessType"
                                    name="businessType"
                                    required
                                    className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
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
                                className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                            >
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Sign up
                            </button>
                        </div>
                        <div className="text-sm text-center">
                            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Already have an account? Log in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
