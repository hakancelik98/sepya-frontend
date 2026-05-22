// lib/hooks/useShippingForm.ts (TAM KOD)

import { useState } from 'react';
import type { Address } from '@/lib/types/checkout';

export function useShippingForm(
    onSubmit?: (data: Address) => void,
    initialData?: Address | null
) {
    const [formData, setFormData] = useState({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        addressLine1: initialData?.addressLine1 || '',
        addressLine2: initialData?.addressLine2 || '',
        city: initialData?.city || '',
        district: initialData?.district || '',
        postalCode: initialData?.postalCode || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!e || !e.target) return;
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = "Ad zorunludur";
        if (!formData.lastName.trim()) newErrors.lastName = "Soyad zorunludur";
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Adres zorunludur";
        if (!formData.city.trim()) newErrors.city = "Şehir zorunludur";
        if (!formData.district.trim()) newErrors.district = "İlçe zorunludur";
        if (!formData.postalCode.trim()) newErrors.postalCode = "Posta kodu zorunludur";
        if (!formData.phone.trim()) newErrors.phone = "Telefon zorunludur";
        if (!formData.email.trim()) newErrors.email = "E-posta zorunludur";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('🚀 Form submit çalıştı');

        if (!validate()) {
            console.log('❌ Form geçersiz, submit iptal');
            return;
        }

        setIsSubmitting(true);
        console.log('📤 onSubmit çağrılıyor...', formData);

        try {
            if (onSubmit) {
                await onSubmit(formData as Address);
                console.log('✅ onSubmit başarılı');
            }
        } catch (error) {
            console.error('❌ onSubmit hatası:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid =
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.addressLine1.trim() !== '' &&
        formData.city.trim() !== '' &&
        formData.district.trim() !== '' &&
        formData.postalCode.trim() !== '' &&
        formData.phone.trim() !== '' &&
        formData.email.trim() !== '';

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit: handleFormSubmit  // ← rename
    };
}