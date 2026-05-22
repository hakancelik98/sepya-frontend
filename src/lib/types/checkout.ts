// lib/types/checkout.ts
// ✅ TEK KAYNAK — cart.ts ve cart.types.ts silindi, her şey buradan import edilmeli.

// ============================================================
// BACKEND'DEN GELEN RAW CART TİPLERİ
// Bunlar API response'larını birebir temsil eder.
// ============================================================

export interface Product {
    id: number;
    title: string;
    imageUrl: string;
    price: number;
    discountedPrice: number | null;
    stockQuantity: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
}

export interface BackendCartItem {
    id: number;
    product: Product;
    quantity: number;
    subtotal: number;
    addedAt: string;
}

export interface BackendCart {
    id: number;
    userId: number;
    items: BackendCartItem[];
    totalPrice: number;
    totalItems: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// FRONTEND UI CART TİPLERİ
// CartContext ve checkout akışında kullanılır.
// category burada string — UI'da sadece isim gösterilir.
// ============================================================

export interface CartItem {
    id: number;
    product: {
        id: number;
        title: string;
        imageUrl: string;
        price: number;
        discountedPrice: number | null;
        stockQuantity: number;
        category: string; // sadece name — UI'da full object gerekmez
    };
    quantity: number;
    subtotal: number;
    addedAt: string;
}

export interface Cart {
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
}

// ============================================================
// ADAPTER — BackendCart → Cart dönüşümü
// CartContext içinde bir kez çağrılır, başka yerde çağrılmaz.
// ============================================================

export function adaptBackendCart(backendCart: BackendCart): Cart {
    return {
        items: backendCart.items.map((item) => ({
            id: item.id,
            product: {
                id: item.product.id,
                title: item.product.title,
                imageUrl: item.product.imageUrl,
                price: item.product.price,
                discountedPrice: item.product.discountedPrice,
                stockQuantity: item.product.stockQuantity,
                category:
                    typeof item.product.category === "string"
                        ? item.product.category
                        : item.product.category.name,
            },
            quantity: item.quantity,
            subtotal: item.subtotal,
            addedAt: item.addedAt,
        })),
        totalPrice: backendCart.totalPrice,
        totalItems: backendCart.totalItems,
    };
}

// ============================================================
// ADDRESS
// ============================================================

export interface Address {
    id?: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    postalCode: string;
    phone: string;
    email: string;
}

// ============================================================
// PAYMENT
// ============================================================

export interface CardDetails {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    saveCard?: boolean;
}

export type PaymentMethodType = "CREDIT_CARD" | "COD" | "BANK_TRANSFER";

export type PaymentMethod =
    | { type: "CREDIT_CARD"; cardDetails: CardDetails }
    | { type: "COD";          cardDetails?: null }
    | { type: "BANK_TRANSFER"; cardDetails?: null };

// ============================================================
// CHECKOUT FLOW
// ============================================================

export type CheckoutStep = "shipping" | "payment" | "complete";

// ============================================================
// API REQUEST TİPLERİ
// ============================================================

export interface CheckoutStartRequest {
    shippingAddress: {
        firstName: string;
        lastName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        district: string;
        postalCode: string;
        phone: string;
        email: string;
    };
    idempotencyKey: string;
    provider?: string;
    isGuest?: boolean;
    guestEmail?: string | null;
    guestItems?: { productId: number; quantity: number }[];
    couponCode?: string | null;
    paymentMethod?: string;
    shippingFee?: number;
    discountAmount?: number;
    // ✅ totalAmount frontend'den gönderilmeye devam ediyor
    //    ama backend bunu doğrulama için kullanıyor, kesin tutar olarak değil.
    totalAmount?: number;
}

// ============================================================
// API RESPONSE TİPLERİ
// ============================================================

export interface CheckoutStartResponse {
    orderId: number;
    orderNumber: string;
    paymentId: number;
    redirectUrl?: string;
    clientSecret?: string | null;
    status: string;
    message?: string;
}

export interface CheckoutResultResponse {
    paymentId: number;
    paymentStatus: string;
    orderId: number;
    orderNumber: string;
    orderStatus: string;
    message: string;
}

// ============================================================
// FİNANS
// ============================================================

export interface BankInfo {
    bankName?: string;
    bankBranch?: string;
    accountHolder?: string;
    iban?: string;
    accountNumber?: string;
    swiftCode?: string;
}

export interface FinanceCalculation {
    shippingPrice?: number;
    extraFee?: number;
    discount?: number;
    bankInfo?: BankInfo | null;
}