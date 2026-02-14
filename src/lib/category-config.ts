export type BusinessType = 'doctor' | 'hr' | 'lawyer' | 'consultant' | 'service';

export interface CategoryConfig {
    label: string;
    slotDuration: number;
    fields: {
        name: string;
        label: string;
        type: 'text' | 'textarea' | 'url';
        required?: boolean;
    }[];
}

export const CATEGORY_CONFIG: Record<BusinessType, CategoryConfig> = {
    doctor: {
        label: 'Appointments',
        slotDuration: 15,
        fields: [
            { name: 'symptoms', label: 'Symptoms', type: 'textarea', required: true },
            { name: 'insurance_provider', label: 'Insurance Provider', type: 'text' }
        ]
    },
    barber: {
        label: 'Haircuts',
        slotDuration: 30,
        fields: [
            { name: 'style_preference', label: 'Style Preference', type: 'text' },
            { name: 'hair_type', label: 'Hair Type (Short/Long/Curly)', type: 'text' }
        ]
    },
    hr: {
        label: 'Interviews',
        slotDuration: 45,
        fields: [
            { name: 'role', label: 'Job Role', type: 'text', required: true },
            { name: 'resume_link', label: 'Resume Link', type: 'url', required: true }
        ]
    },
    lawyer: {
        label: 'Consultations',
        slotDuration: 60,
        fields: [
            { name: 'case_type', label: 'Case Type', type: 'text', required: true },
            { name: 'notes', label: 'Case Notes', type: 'textarea' }
        ]
    },
    consultant: {
        label: 'Sessions',
        slotDuration: 60,
        fields: [
            { name: 'topic', label: 'Discussion Topic', type: 'text', required: true },
            { name: 'company_name', label: 'Company Name', type: 'text' }
        ]
    },
    service: {
        label: 'Jobs',
        slotDuration: 90,
        fields: [
            { name: 'service_type', label: 'Service Type', type: 'text', required: true },
            { name: 'address', label: 'Service Address', type: 'textarea', required: true }
        ]
    }
};
