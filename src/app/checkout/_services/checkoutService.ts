// app/checkout/_services/checkoutService.ts

import type {
    CheckoutStartResponse,
    CheckoutResultResponse,
    CheckoutStartRequest,
    FinanceCalculation,
} from "@/lib/types/checkout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const checkoutService = {
    /**
     * Checkout başlatma
     */
    async startCheckout(data: CheckoutStartRequest): Promise<CheckoutStartResponse> {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        // Guest cart verilerini al
        const guestCartJson =
            typeof window !== "undefined"
                ? localStorage.getItem("guestCart")
                : null;
        const guestCart = guestCartJson ? JSON.parse(guestCartJson) : { items: [] };

        const mappedData = {
            ...data,
            isGuest: !token,
            guestEmail: !token ? data.shippingAddress.email : null,
            guestItems: !token
                ? guestCart.items.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                }))
                : [],
            shippingAddress: {
                fullName: `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`.trim(),
                addressLine: `${data.shippingAddress.addressLine1} ${data.shippingAddress.addressLine2 || ""}`.trim(),
                phone: data.shippingAddress.phone,
                city: data.shippingAddress.city,
                district: data.shippingAddress.district,
                postalCode: data.shippingAddress.postalCode,
            },
            // ✅ EKLENEN: PaymentMethod backend'e gönderiliyor
            paymentMethod: data.paymentMethod || "CREDIT_CARD", // Varsayılan: CREDIT_CARD
        };

        const res = await fetch(`${API_URL}/checkout/start`, {
            method: "POST",
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mappedData),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "Checkout başlatılamadı");
        }

        return res.json() as Promise<CheckoutStartResponse>;
    },

    /**
     * Ödeme sonucunu getirme
     */
    async getResult(paymentId: number): Promise<CheckoutResultResponse> {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(
            `${API_URL}/checkout/result?paymentId=${paymentId}`,
            { headers }
        );

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "Ödeme sonucu alınamadı");
        }

        return res.json() as Promise<CheckoutResultResponse>;
    },
};

/**
 * Finance Service - Kargo ve ödeme bedelleri
 */
export const financeService = {
    /**
     * Toplam tutara göre kargo ve ödeme bedelleri hesaplama
     */
    async calculateShipping(
        cartTotal: number,
        paymentMethod: string
    ): Promise<FinanceCalculation> {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(
                `${API_URL}/public/finance/calculate-shipping?amount=${cartTotal}&paymentMethod=${paymentMethod}`,
                { headers }
            );

            if (!res.ok) {
                console.warn("Finance API hatası:", res.status);
                // Varsayılan değerler döndür
                return {
                    shippingPrice: 0,
                    extraFee: 0,
                    discount: 0,
                };
            }

            return res.json() as Promise<FinanceCalculation>;
        } catch (error) {
            console.error("Finance hesaplama hatası:", error);
            // Fallback değerler
            return {
                shippingPrice: 0,
                extraFee: 0,
                discount: 0,
            };
        }
    },

    /**
     * ✅ YENI: Kupon doğrulama
     */
    async validateCoupon(
        code: string,
        cartAmount: number,
        userId?: number | null // ✅ YENİ parametre
    ): Promise<{ discount: number; code: string }> {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/public/finance/validate-coupon`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                code,
                amount: cartAmount,
                userId: userId || null, // ✅ YENİ: userId'yi backend'e gönder
            }),
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || "Kupon geçersiz");
        }

        return res.json();
    },
};