"use client";
import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";
import EmptyCart from "./_components/EmptyCart";
import Link from "next/link";

export default function CartPage() {
    const { cart, isLoading, updateQuantity, removeFromCart, clearCart, refreshCart } = useCart();

    useEffect(() => {
        refreshCart();
    }, []);

    if (isLoading && !cart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-sm font-bold tracking-wide animate-pulse">
                    Sepet Yükleniyor…
                </span>
            </div>
        );
    }

    const items = cart?.items || [];

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-24">
                <EmptyCart />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* HEADER */}
            <div className="mb-10">
                <Link
                    href="/products"
                    className="text-xs font-semibold text-gray-500 hover:text-black transition"
                >
                    ← Alışverişe Devam Et
                </Link>

                <h1 className="text-4xl font-bold text-black mt-4">
                    Sepetim
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    {items.length} ürün
                </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* ITEMS */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeFromCart}
                            isLoading={isLoading}
                        />
                    ))}
                </div>

                {/* SUMMARY */}
                <div className="lg:col-span-1">
                    <CartSummary cart={cart!} onClearCart={clearCart} />
                </div>
            </div>
        </div>
    );
}
