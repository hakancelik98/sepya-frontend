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
    const [couponDiscount, setCouponDiscount] = useState(0);   // Kupon indirimi (AYRI)

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
            setShippingFee(data.shippingFee);
            setPaymentServiceFee(data.paymentServiceFee);
            setPaymentDiscount(data.paymentDiscount);
        },
        []
    );

    const handleCouponUpdate = useCallback((discount: number) => {
        setCouponDiscount(discount);
    }, []);

    /**
     * Paratika Direct POST 3D formunu oluşturup tarayıcıdan DOĞRUDAN
     * Paratika'ya gönderir. Kart bilgisi backend'e HİÇ gitmez.
     */
    const submitToParatikaDirectPost = useCallback(
        (sessionToken: string, cardDetails: {
            cardNumber: string;
            cardholderName: string;
            expiryMonth: string;
            expiryYear: string;
            cvv: string;
        }) => {
            const directPost3dUrl = `https://vpos.paratika.com.tr/paratika/api/v2/post/sale3d/${sessionToken}`;

            // Paratika resmi dokümantasyonu: CARDEXPIRY [mm.yy] formatında olmalı
            // (2 haneli yıl - 4 haneye ÇEVİRME, olduğu gibi gönder)
            const twoDigitYear = cardDetails.expiryYear.length === 4
                ? cardDetails.expiryYear.slice(-2)
                : cardDetails.expiryYear;

            const form = document.createElement("form");
            form.method = "POST";
            form.action = directPost3dUrl;
            form.style.display = "none";

            const fields: Record<string, string> = {
                CARDPAN: cardDetails.cardNumber.replace(/\s/g, ""),
                CARDEXPIRY: `${cardDetails.expiryMonth}.${twoDigitYear}`,
                CARDCVV: cardDetails.cvv,
                NAMEONCARD: cardDetails.cardholderName,
            };

            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        },
        []
    );

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
                    // ✅ DEĞİŞTİ: mock yerine paratika
                    provider:
                        payment.type === "CREDIT_CARD" ? "paratika" : undefined,
                    shippingFee,
                    discountAmount: paymentDiscount + couponDiscount,
                    totalAmount: total,
                    couponCode: null,
                    paymentMethod: payment.type,
                };

                const response = await checkoutService.startCheckout(checkoutData);

                if (payment.type === "CREDIT_CARD") {
                    // ✅ DEĞİŞTİ: redirectUrl yerine clientSecret (sessionToken) kullanılıyor.
                    // Kart bilgisi backend'e değil, doğrudan Paratika'ya POST ediliyor.
                    const sessionToken = response.clientSecret;

                    if (!sessionToken) {
                        throw new Error("Ödeme oturumu (sessionToken) alınamadı");
                    }

                    if (!payment.cardDetails) {
                        throw new Error("Kart bilgileri eksik");
                    }

                    submitToParatikaDirectPost(sessionToken, payment.cardDetails);
                    // NOT: submit sonrası tarayıcı Paratika'ya gidip 3D Secure akışına
                    // girecek, bu fonksiyon buradan sonra bir şey yapmaz (sayfa zaten
                    // yönlendirilmiş olacak). isProcessing bilerek false yapılmıyor,
                    // form submit ile sayfa değişecek.
                } else {
                    // COD veya Havale için success sayfasına
                    router.push(`/checkout/success?order=${response.orderNumber}&method=${payment.type.toLowerCase()}`);
                }
            } catch (err: any) {
                console.error("Checkout hatası:", err);
                setError(err.message || "Ödeme işlemi başlatılamadı");
                setIsProcessing(false);
            }
        },
        [shippingAddress, shippingFee, paymentDiscount, couponDiscount, calculateTotal, router, submitToParatikaDirectPost]
    );

    // Back to Shipping
    const handleBackToShipping = useCallback(() => {
        setCurrentStep("shipping");
        setError(null);
    }, []);

    return {
        currentStep,
        shippingAddress,
        paymentMethod,
        shippingFee,
        paymentServiceFee,
        paymentDiscount,
        couponDiscount,
        isProcessing,
        error,
        total: calculateTotal(),
        handleShippingSubmit,
        handleTotalsUpdate,
        handleCouponUpdate,
        handlePaymentSubmit,
        handleBackToShipping,
        setError,
    };
}