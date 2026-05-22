"use client";

import { X, Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {router} from "next/client";

export default function CartDrawer() {
    const {
        cart,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
        isLoading,
        isGuestCart,
    } = useCart();

    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    const { openAuthModal } = useAuth();

    const items = cart?.items || [];
    const totalPrice = cart?.totalPrice || 0;
    const itemCount = cart?.totalItems || 0;

    const shippingLimit = 1500;
    const remaining = shippingLimit - totalPrice;
    const progress = Math.min((totalPrice / shippingLimit) * 100, 100);

    const fixUrl = (path: string) => {
        if (!path) return "/placeholder.jpg";
        return path.startsWith("http")
            ? path
            : `${ASSET_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
    };

    const handleCheckoutClick = () => {
        closeCart();
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-white z-[101] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="px-5 py-3 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-base font-bold tracking-tight text-black">
                                    Sepetim {isGuestCart && <span className="text-[10px] text-gray-400 font-normal ml-1">(Misafir)</span>}
                                </h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    {itemCount} Ürün
                                </p>
                            </div>
                            <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                                <X size={20} className="text-black" />
                            </button>
                        </div>

                        {/* Misafir Uyarısı - Ultra Kompakt Madde Yapısı */}
                        {isGuestCart && items.length > 0 && (
                            <div className="mx-4 mt-3 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                                <ul className="grid grid-cols-1 gap-1.5">
                                    {[
                                        "Siparişlerinizi kolayca takip edin",
                                        "Özel indirimlerden faydalanın",
                                        "Favori ürünlerinizi kaydedin"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                                            <span className="text-[10px] text-emerald-900 font-semibold leading-none">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => { closeCart(); openAuthModal(); }}
                                    className="mt-2 w-full py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider rounded-md hover:bg-emerald-700 transition-colors"
                                >
                                    Giriş Yap / Üye Ol
                                </button>
                            </div>
                        )}

                        {/* Shipping Bar */}
                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/30">
                            <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">
            {remaining > 0
                ? `${remaining.toLocaleString("tr-TR")} TL kaldı`
                : "Kargo Bedava!"}
        </span>
                                <Truck size={14} className={remaining <= 0 ? "text-green-600" : "text-gray-400"} />
                            </div>
                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className={`h-full ${progress === 100 ? "bg-green-500" : "bg-black"}`}
                                />
                            </div>
                        </div>

                        {/* Items - Optimize Edilmiş Kompakt Kartlar */}
                        <div className="flex-1 overflow-y-auto px-5 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30 text-zinc-700">
                                    <ShoppingBag size={40} strokeWidth={1.5} />
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center">
                                        Sepetiniz Henüz Boş
                                    </p>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const isAtMaxStock = item.quantity >= item.product.stockQuantity;
                                    const categoryName = typeof item.product.category === 'object'
                                        ? item.product.category.name
                                        : item.product.category;

                                    return (
                                        <div key={item.id} className="py-4 border-b border-gray-50 flex gap-3 group last:border-0">
                                            {/* Resim Alanı - Küçültüldü (w-20 h-24) */}
                                            <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                                <img
                                                    src={fixUrl(item.product.imageUrl)}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div className="space-y-0.5">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h3 className="text-[12px] font-bold text-gray-900 leading-tight truncate pr-1">
                                                            {item.product.title}
                                                        </h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.product.id)}
                                                            disabled={isLoading}
                                                            className="text-gray-300 hover:text-red-500 transition-colors p-1 -mt-1"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                                        {categoryName}
                                                    </p>
                                                </div>

                                                {/* Stok Uyarısı - Daha Az Yer Kaplar */}
                                                {isAtMaxStock && (
                                                    <p className="text-[8px] text-orange-600 font-bold leading-none mb-1">
                                                        Maksimum stok sınırı
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    {/* Miktar Seçici - Daha Küçük (w-6 h-6) */}
                                                    <div className="flex items-center border border-gray-100 rounded-lg bg-gray-50/50 p-0.5">
                                                        <button
                                                            disabled={isLoading || item.quantity <= 1}
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md disabled:opacity-20 transition-all shadow-sm"
                                                        >
                                                            <Minus size={10} strokeWidth={4} />
                                                        </button>
                                                        <span className="w-6 text-center text-black font-black text-[10px]">
                                    {item.quantity}
                                </span>
                                                        <button
                                                            disabled={isLoading || isAtMaxStock}
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md disabled:opacity-20 transition-all shadow-sm"
                                                        >
                                                            <Plus size={10} strokeWidth={4} />
                                                        </button>
                                                    </div>

                                                    <span className="font-black text-black text-[13px] tracking-tight">
                                {item.subtotal.toLocaleString("tr-TR")} TL
                            </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer - Kompakt Versiyon */}
                        {/* Footer - Düzeltilmiş ve Kompakt Versiyon */}
                        {items.length > 0 && (
                            <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                                {/* Tutar Alanı */}
                                <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                Toplam
            </span>
                                    <span className="text-xl font-black text-black tracking-tighter">
                {totalPrice.toLocaleString("tr-TR")} TL
            </span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {/* ANA AKSİYON: Sepete Git / Satın Al */}
                                    <Link
                                        href="/cart"
                                        onClick={closeCart}
                                        className="w-full bg-black text-white text-center py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-black/5"
                                    >
                                        Sepete Git ve Onayla
                                    </Link>

                                    {/* İKİNCİL AKSİYON: Sadece Drawer'ı kapatır */}
                                    <button
                                        onClick={closeCart}
                                        className="w-full bg-white border border-gray-200 text-gray-500 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                                    >
                                        Alışverişe Devam Et
                                    </button>
                                </div>

                                {/* Güvenlik İkonu */}
                                <div className="mt-3 flex items-center justify-center gap-1.5 opacity-50">
                                    <ShieldCheck size={12} className="text-emerald-600" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                256-Bit Güvenli Ödeme
            </span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}