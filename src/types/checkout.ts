export interface CheckoutStartResponse {
    orderId: number;
    orderNumber: string;
    paymentId: number;
    redirectUrl?: string;
    clientSecret?: string | null;
    status: string;
    message?: string; // Opsiyonel bilgi mesajı
}

export interface CheckoutResultResponse {
    paymentId: number;
    paymentStatus: string;
    orderId: number;
    orderNumber: string;
    orderStatus: string;
    message: string;
}
