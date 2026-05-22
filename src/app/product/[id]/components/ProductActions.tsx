"use client";
import { useState } from "react";
import { ShoppingBag, Minus, Plus, Bell } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function ProductActions({ product }: { product: any }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, openCart } = useCart();

    const isOutOfStock = product.stockQuantity === 0;
    const maxStock = product.stockQuantity || 0;

    const handleAddToCart = async () => {
        if (isOutOfStock) {
            alert("Bu ürün şu anda stokta bulunmamaktadır");
            return;
        }

        try {
            await addToCart(product.id, quantity);
            openCart();
        } catch (err: any) {
            console.error("Sepete ekleme hatası:", err);
            // Hata mesajı CartContext'te zaten gösteriliyor
        }
    };

    const handleBuyNow = async () => {
        if (isOutOfStock) {
            alert("Bu ürün şu anda stokta bulunmamaktadır");
            return;
        }

        try {
            await addToCart(product.id, quantity);
            window.location.href = "/checkout";
        } catch (err) {
            console.error("Hemen Al hatası:", err);
        }
    };

    const handleNotifyMe = () => {
        alert(`"${product.title}" ürünü için stok bildirimi açıldı!`);
        // Backend'e bildirim kaydı yapılabilir
    };

    if (isOutOfStock) {
        return (
            <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">
                        Bu ürün şu anda stokta bulunmamaktadır
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Stok Uyarısı */}
            {maxStock > 0 && maxStock < 2 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                        ⚠️ Son {maxStock} Adet Kaldı!
                    </p>
                </div>
            )}

            <div className="flex gap-3 h-14">
                <div className="flex items-center border border-slate-200 rounded-full px-6 gap-8 bg-white">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="hover:text-blue-600 transition-colors disabled:opacity-30"
                        disabled={quantity <= 1}
                    >
                        <Minus size={12} />
                    </button>
                    <span className="text-[12px] font-black">{quantity}</span>
                    <button
                        onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                        className="hover:text-blue-600 transition-colors disabled:opacity-30"
                        disabled={quantity >= maxStock}
                    >
                        <Plus size={12} />
                    </button>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-black/10 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <ShoppingBag size={14} /> Sepete Ekle
                </button>
            </div>
            <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] py-2 hover:text-black transition-colors italic disabled:opacity-30 disabled:cursor-not-allowed"
            >
                Hemen Satın Al — Hızlı Ödeme
            </button>
        </div>
    );
}