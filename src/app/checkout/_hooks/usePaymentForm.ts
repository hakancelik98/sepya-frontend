import { useState } from "react";

type FormData = {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    saveCard: boolean;
};

type Errors = Record<string, string>;
type Touched = Record<string, boolean>;

export function usePaymentForm() {
    const [formData, setFormData] = useState<FormData>({
        cardNumber: "",
        cardholderName: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        saveCard: false,
    });

    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // CARD BRAND DETECTION
    const detectCardBrand = (cardNumber: string) => {
        const cleaned = cardNumber.replace(/\s/g, "");
        if (cleaned.startsWith("4")) return "visa";
        if (cleaned.startsWith("5")) return "mastercard";
        if (cleaned.startsWith("3")) return "amex";
        return "unknown";
    };

    const cardBrand = detectCardBrand(formData.cardNumber);

    // VALIDATION
    const isValid =
        formData.cardNumber.replace(/\s/g, "").length >= 16 &&
        formData.cardholderName.trim().length > 2 &&
        formData.expiryMonth.length === 2 &&
        formData.expiryYear.length === 2 &&
        formData.cvv.length >= (cardBrand === "amex" ? 4 : 3);

    // HANDLERS
    const handleChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error for this field if it exists
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleBlur = (field: keyof FormData) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        // Basic validation on blur
        if (!formData[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: "Bu alan zorunludur"
            }));
        }
    };

    const handleSubmit = async (onSuccess: (data: any) => void) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        onSuccess({
            type: "CREDIT_CARD",
            cardDetails: formData,
        });

        setIsSubmitting(false);
    };

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        isValid,
        cardBrand,
        handleChange,
        handleBlur,
        handleSubmit,
    };
}