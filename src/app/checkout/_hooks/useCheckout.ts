// app/checkout/_hooks/useCheckout.ts

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
    Address,
    PaymentMethod,
    CheckoutStep,
    CartItem,
} from "@/lib/types/checkout";
import { checkoutService } from "@/app/checkout/_services/checkoutService";

// UUID oluştur
function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

interface UseCheckoutProps {
    cartItems: CartItem[];
    cartSubtotal: number;
}

export function useCheckout({ cartItems, cartSubtotal }: UseCheckoutProps) {
    const router = useRouter();

    // Step Management
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");

    // Form Data
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

    // Financial Data
    const [shippingFee, setShippingFee] = useState(0);
    const [paymentServiceFee, setPaymentServiceFee] = useState(0);
    const [paymentDiscount, setPaymentDiscount] = useState(0); // Havale indirimi
    const [couponDiscount, setCouponDiscount] = useState(0);   // ✅ Kupon indirimi (AYRI)

    // UI State
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculated Total
    const calculateTotal = useCallback(() => {
        return (
            cartSubtotal +
            shippingFee +
            paymentServiceFee -
            paymentDiscount -
            couponDiscount
        );
    }, [cartSubtotal, shippingFee, paymentServiceFee, paymentDiscount, couponDiscount]);

    // Step 1: Shipping Form Submit
    const handleShippingSubmit = useCallback((address: Address) => {
        console.log("📦 Teslimat bilgileri alındı:", address);
        setShippingAddress(address);
        setCurrentStep("payment");
        setError(null);
    }, []);

    // Step 2: Payment Totals Update
    const handleTotalsUpdate = useCallback(
        (data: {
            shippingFee: number;
            paymentServiceFee: number;
            paymentDiscount: number;
        }) => {
            console.log("💰 Finansal veriler güncellendi:", data);
            setShippingFee(data.shippingFee);
            setPaymentServiceFee(data.paymentServiceFee);
            setPaymentDiscount(data.paymentDiscount); // Sadece havale indirimi
        },
        []
    );

    // ✅ YENI: Kupon indirimini güncelleyen fonksiyon
    const handleCouponUpdate = useCallback((discount: number) => {
        console.log("🎫 Kupon indirimi güncellendi:", discount);
        setCouponDiscount(discount);
    }, []);

    // Step 3: Payment Submit & Start Checkout
    const handlePaymentSubmit = useCallback(
        async (payment: PaymentMethod) => {
            if (!shippingAddress) {
                setError("Teslimat bilgileri eksik");
                return;
            }

            setIsProcessing(true);
            setError(null);
            setPaymentMethod(payment);

            try {
                console.log("🚀 Checkout başlatılıyor...");

                const idempotencyKey = generateUUID();
                const total = calculateTotal();

                const checkoutData = {
                    shippingAddress: {
                        firstName: shippingAddress.firstName,
                        lastName: shippingAddress.lastName,
                        addressLine1: shippingAddress.addressLine1,
                        addressLine2: shippingAddress.addressLine2 || "",
                        city: shippingAddress.city,
                        district: shippingAddress.district,
                        postalCode: shippingAddress.postalCode,
                        phone: shippingAddress.phone,
                        email: shippingAddress.email,
                    },
                    idempotencyKey,
                    provider:
                        payment.type === "CREDIT_CARD" ? "mock" : undefined,
                    shippingFee,
                    discountAmount: paymentDiscount + couponDiscount, // ✅ İki indirim de gönderiliyor
                    totalAmount: total,
                    couponCode: null,
                    paymentMethod: payment.type, // ✅ EKLENEN: PaymentMethod backend'e gönderiliyor
                };

                console.log("📤 Backend'e gönderilen veri:", checkoutData);

                const response = await checkoutService.startCheckout(checkoutData);

                console.log("✅ Checkout response:", response);

                // Ödeme yöntemine göre yönlendirme
                if (payment.type === "CREDIT_CARD") {
                    // 3D Secure sayfasına yönlendir
                    if (response.redirectUrl) {
                        window.location.href = response.redirectUrl;
                    } else {
                        throw new Error("3D Secure URL bulunamadı");
                    }
                } else {
                    // COD veya Havale için success sayfasına
                    router.push(`/checkout/success?order=${response.orderNumber}&method=${payment.type.toLowerCase()}`);
                }
            } catch (err: any) {
                console.error("❌ Checkout hatası:", err);
                setError(err.message || "Ödeme işlemi başlatılamadı");
                setIsProcessing(false);
            }
        },
        [shippingAddress, shippingFee, paymentDiscount, couponDiscount, calculateTotal, router]
    );

    // Back to Shipping
    const handleBackToShipping = useCallback(() => {
        setCurrentStep("shipping");
        setError(null);
    }, []);

    return {
        // State
        currentStep,
        shippingAddress,
        paymentMethod,
        shippingFee,
        paymentServiceFee,
        paymentDiscount,
        couponDiscount,
        isProcessing,
        error,

        // Computed
        total: calculateTotal(),

        // Handlers
        handleShippingSubmit,
        handleTotalsUpdate,
        handleCouponUpdate, // ✅ YENI
        handlePaymentSubmit,
        handleBackToShipping,
        setError,
    };
}