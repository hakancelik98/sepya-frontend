"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CartButton() {
    const { cart, openCart } = useCart();
    const itemCount = cart?.totalItems || 0;

    return (
        <button
            onClick={openCart}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
            <ShoppingCart size={20} className="text-gray-700" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    );
}