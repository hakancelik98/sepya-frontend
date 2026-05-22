"use client";
import Link from "next/link";
import { Cart } from "@/lib/types/checkout";

interface CartSummaryProps {
    cart: Cart;
    onClearCart: () => void;
}

export default function CartSummary({ cart, onClearCart }: CartSummaryProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
            {/* TITLE */}
            <h2 className="text-xl font-bold text-black mb-8">
                Sipariş Özeti
            </h2>

            {/* ROWS */}
            <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Ürün Sayısı</span>
                    <span className="font-semibold text-black">
                        {cart.totalItems}
                    </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Ara Toplam</span>
                    <span className="font-semibold text-black">
                        {cart.totalPrice.toLocaleString("tr-TR")} TL
                    </span>
                </div>
            </div>

            {/* DIVIDER */}
            <div className="my-6 h-px bg-gray-200" />

            {/* TOTAL */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                        Toplam
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                        KDV dahil
                    </p>
                </div>

                <p className="text-3xl font-bold text-black tracking-tight">
                    {cart.totalPrice.toLocaleString("tr-TR")} TL
                </p>
            </div>

            {/* CTA */}
            <Link
                href="/checkout"
                className="block w-full bg-black text-white text-center py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition"
            >
                Ödemeye Geç
            </Link>

            {/* CLEAR */}
            <button
                onClick={onClearCart}
                className="block w-full text-center text-xs text-gray-400 hover:text-red-600 mt-5 transition"
            >
                Sepeti Temizle
            </button>
        </div>
    );
}
