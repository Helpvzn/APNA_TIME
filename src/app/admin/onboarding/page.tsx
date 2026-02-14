'use client'

import { useState } from 'react'
import { createOrganization } from './actions'
import { Loader2, Building2, Stethoscope, Scissors, Briefcase } from 'lucide-react'

// Options match CATEGORY_CONFIG keys
const BUSINESS_TYPES = [
    { id: 'doctor', label: 'Doctor / Clinic', icon: Stethoscope, desc: '15 min slots' },
    { id: 'barber', label: 'Barber / Salon', icon: Scissors, desc: '30 min slots' },
    { id: 'consultant', label: 'Consultant / Agency', icon: Briefcase, desc: '60 min slots' },
]

export default function OnboardingPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedType, setSelectedType] = useState('doctor')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        setError(null)

        // Append selected type manually since it's a custom UI state
        formData.append('businessType', selectedType)

        const result = await createOrganization(formData)
        if (result?.error) {
            setError(result.error)
            setIsSubmitting(false)
        }
        // Redirect happens in server action
    }

    return (
        <div className="min-h-screen bg-[#150305] flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-wine-500 to-wine-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-wine-gold/20 shadow-lg shadow-wine-gold/10">
                        <Building2 className="w-8 h-8 text-wine-gold" />
                    </div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                        Setup Your Business
                    </h1>
                    <p className="mt-2 text-gray-400">Tell us about your organization to get started.</p>
                </div>

                {/* Form Card */}
                <div className="bg-[#2d080f] border border-wine-gold/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    {/* Decorative Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-wine-gold/5 blur-[80px] rounded-full poiter-events-none" />

                    <form action={handleSubmit} className="space-y-6 relative z-10">

                        {/* Business Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
                            <input
                                type="text"
                                name="businessName"
                                placeholder="e.g. City Health Clinic"
                                required
                                className="w-full bg-[#150305] border border-wine-gold/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-wine-gold/50 focus:ring-1 focus:ring-wine-gold/50 transition-all font-medium"
                            />
                        </div>

                        {/* Business Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Business Type</label>
                            <div className="grid grid-cols-1 gap-3">
                                {BUSINESS_TYPES.map((type) => {
                                    const Icon = type.icon
                                    const isSelected = selectedType === type.id
                                    return (
                                        <div
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id)}
                                            className={`
                                                cursor-pointer flex items-center p-3 rounded-xl border transition-all duration-200 group
                                                ${isSelected
                                                    ? 'bg-wine-gold/10 border-wine-gold text-white shadow-md shadow-wine-gold/5'
                                                    : 'bg-[#150305] border-transparent hover:border-wine-gold/20 text-gray-400 hover:text-gray-200'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                p-2 rounded-lg mr-3 transition-colors
                                                ${isSelected ? 'bg-wine-gold text-wine-900' : 'bg-[#20050a] text-gray-500 group-hover:text-gray-400'}
                                            `}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`text-sm font-semibold ${isSelected ? 'text-wine-gold' : ''}`}>{type.label}</h3>
                                                <p className="text-xs opacity-70">{type.desc}</p>
                                            </div>
                                            <div className={`
                                                w-4 h-4 rounded-full border flex items-center justify-center
                                                ${isSelected ? 'border-wine-gold' : 'border-gray-700'}
                                            `}>
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-wine-gold" />}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-200 text-sm flex items-center">
                                <span className="mr-2">⚠️</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition-all
                                ${isSubmitting
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-wine-gold to-yellow-600 text-wine-950 hover:opacity-90 hover:scale-[1.02] hover:shadow-wine-gold/20'
                                }
                            `}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating Account...</>
                            ) : (
                                'Complete Setup'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
