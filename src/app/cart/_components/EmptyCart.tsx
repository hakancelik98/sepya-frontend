"use client";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-8">
                <ShoppingBag size={64} className="text-gray-300" />
            </div>

            <h2 className="text-3xl font-black text-black mb-3">
                Sepetiniz Boş
            </h2>

            <p className="text-sm text-gray-500 max-w-md mb-10">
                Sepetinizde henüz ürün yok. Alışverişe başlamak için ürünleri inceleyin.
            </p>

            <Link
                href="/products"
                className="bg-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition"
            >
                Alışverişe Başla
            </Link>
        </div>
    );
}
