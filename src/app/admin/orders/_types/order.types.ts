import { PaymentStatus } from "@/app/admin/orders/_types/payment-status.types";

export enum OrderStatus {
    PENDING = "PENDING",
    PREPARING = "PREPARING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}

export interface Order {
    id: number;
    orderNumber: string;
    customer: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalPrice: number;
    createdAt: string;
    itemCount: number;
    paymentMethod: string;
}

export interface OrderDetail extends Order {
    orderItems: OrderItem[];
    shippingAddress: Address;
    trackingNumber?: string;
    adminNote?: string;
    invoicePath?: string | null;
    updatedAt: string;
    provider: string;
    trackingUrlTemplate?: string;
}

export interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
        imageUrl: string;
    };
    quantity: number;
    priceAtPurchase: number;
    subtotal: number;
}

export interface Address {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    district: string;
    postalCode: string;
}

export interface OrderStats {
    total: number;
    pending: number;
    preparing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    todayOrders: number;
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
}

export interface OrderFilters {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    size?: number;
}

export interface PaginatedOrders {
    content: Order[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
}