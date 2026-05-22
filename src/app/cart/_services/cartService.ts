// app/cart/_services/cartService.ts

import type { Cart } from "@/lib/types/checkout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
};

/**
 * 401 veya 403 aldığında CustomEvent fırlatır.
 * CartContext (veya AuthContext) bunu dinleyerek logout + modal açar.
 */
const dispatchAuthError = () => {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
};

async function parseJsonSafe<T>(res: Response): Promise<T> {
    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    if (!res.ok) {
        // Token expire / yetkisiz erişim
        if (res.status === 401 || res.status === 403) {
            dispatchAuthError();
            throw new Error("SESSION_EXPIRED");
        }

        console.error("HTTP Error:", res.status, text);
        throw new Error(text || `HTTP ${res.status}`);
    }

    if (!contentType.includes("application/json")) {
        console.error("JSON bekleniyordu ama şu geldi:", text.slice(0, 300));
        throw new Error("Backend JSON dönmedi. API_URL / auth kontrol et.");
    }

    try {
        return JSON.parse(text) as T;
    } catch (e) {
        console.error("JSON parse hatası. Gelen:", text.slice(0, 300));
        throw new Error("JSON parse edilemedi.");
    }
}

export const cartService = {
    async getCart(): Promise<Cart | null> {
        const token = getToken();
        if (!token) return null;

        const res = await fetch(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return parseJsonSafe<Cart>(res);
    },

    async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
        const token = getToken();
        if (!token) throw new Error("Giriş yapmalısınız");

        const res = await fetch(`${API_URL}/cart/items`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId, quantity }),
        });

        return parseJsonSafe<Cart>(res);
    },

    async updateQuantity(productId: number, quantity: number): Promise<Cart> {
        const token = getToken();
        if (!token) throw new Error("Giriş yapmalısınız");

        const res = await fetch(`${API_URL}/cart/items/${productId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity }),
        });

        return parseJsonSafe<Cart>(res);
    },

    async removeItem(productId: number): Promise<Cart> {
        const token = getToken();
        if (!token) throw new Error("Giriş yapmalısınız");

        const res = await fetch(`${API_URL}/cart/items/${productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        return parseJsonSafe<Cart>(res);
    },

    async clearCart(): Promise<void> {
        const token = getToken();
        if (!token) return;

        try {
            await fetch(`${API_URL}/cart/clear`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (e) {
            console.error("Sepet temizlenemedi ama devam ediliyor.");
        }
    },
};