// app/checkout/_hooks/useCart.ts

"use client";

import { useCart as useCartContext } from "@/contexts/CartContext";

/**
 * Checkout için sepet hook'u - CartContext'i direkt kullanır
 * CartContext zaten guest cart için product bilgilerini API'den çekiyor
 */
export function useCart() {
    const { cart, isLoading } = useCartContext();

    return {
        cart: cart ? {
            items: cart.items || [],
            totalPrice: cart.totalPrice || 0,
            totalItems: cart.totalItems || 0,
        } : null,
        isLoading,
        error: null,
    };
}