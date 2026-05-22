import { OrderStatus, OrderFilters } from "../_types/order.types";

/* ================= BASE URL ================= */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = `${API_BASE_URL}/admin/orders`;

/* ================= TOKEN ================= */

const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
};

/* ================= RESPONSE HANDLER ================= */

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error(`İstek başarısız: ${res.status}`);
    }

    // 204 No Content durumunu güvenli yönet
    if (res.status === 204) return null;

    return res.json();
};

/* ================= SERVICE ================= */

export const orderService = {
    async getAllOrders(filters?: OrderFilters) {
        const token = getToken();
        const params = new URLSearchParams();

        if (filters?.status) params.append("status", filters.status);
        if (filters?.startDate) params.append("startDate", filters.startDate);
        if (filters?.endDate) params.append("endDate", filters.endDate);
        if (filters?.search) params.append("search", filters.search);
        if (filters?.page !== undefined) params.append("page", filters.page.toString());
        if (filters?.size !== undefined) params.append("size", filters.size.toString());

        const url = params.toString()
            ? `${BASE_URL}?${params.toString()}`
            : BASE_URL;

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return handleResponse(res);
    },

    async getOrderDetail(id: number) {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return handleResponse(res);
    },

    async uploadInvoice(orderId: number, file: File) {
        const token = getToken();
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${BASE_URL}/${orderId}/invoice`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        return handleResponse(res);
    },

    async updateStatus(id: number, status: OrderStatus) {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/${id}/status`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        return handleResponse(res);
    },

    async updateTrackingNumber(id: number, trackingNumber: string) {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/${id}/tracking`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ trackingNumber }),
        });

        return handleResponse(res);
    },

    async updateAdminNote(id: number, adminNote: string) {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/${id}/note`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ adminNote }),
        });

        return handleResponse(res);
    },

    async bulkUpdateStatus(orderIds: number[], status: OrderStatus) {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/bulk-status`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderIds, status }),
        });

        return handleResponse(res);
    },

    async getStats() {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/stats`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return handleResponse(res);
    },

    async exportOrderPDF(id: number) {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/${id}/export-pdf`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("PDF Error:", errorText);
            throw new Error("PDF oluşturulamadı");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `siparis-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    },
};