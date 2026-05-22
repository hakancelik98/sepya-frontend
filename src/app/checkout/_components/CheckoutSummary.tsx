// app/checkout/_components/CheckoutSummary.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { CartItem, Address } from "@/lib/types/checkout";
import { TicketPercent, Tag, X, Sparkles, ShoppingBag } from "lucide-react";

interface CheckoutSummaryProps {
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    paymentServiceFee: number;
    paymentDiscount: number;
    couponDiscount: number;
    total: number;
    isCouponOpen: boolean;
    setIsCouponOpen: (open: boolean) => void;
    appliedCoupon: string | null;
    couponCode: string;
    setCouponCode: (code: string) => void;
    onApplyCoupon: () => void;
    onRemoveCoupon: () => void;
    isCouponLoading: boolean;
    isCalculating: boolean;
    shippingAddress: Address | null;
    codFee?: number;
    transferDiscount?: number;
    paymentMethod?: string;
}

const fixImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http")) return url;

    const baseUrl =
        process.env.NEXT_PUBLIC_ASSET_URL ||
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function CheckoutSummary({
                                            items,
                                            subtotal,
                                            shippingFee,
                                            paymentServiceFee,
                                            paymentDiscount,
                                            couponDiscount,
                                            total,
                                            isCouponOpen,
                                            setIsCouponOpen,
                                            appliedCoupon,
                                            couponCode,
                                            setCouponCode,
                                            onApplyCoupon,
                                            onRemoveCoupon,
                                            isCouponLoading,
                                            isCalculating,
                                            shippingAddress,
                                            codFee = 0,
                                            transferDiscount = 0,
                                            paymentMethod = "CREDIT_CARD",
                                        }: CheckoutSummaryProps) {
    return (
        <div className="space-y-4 md:space-y-6">
            {/* ORDER SUMMARY CARD */}
            <div className="bg-zinc-700 md:p-1  md:rounded-[2.5rem] md:shadow-2xl">
                <div className="bg-gray-50 p-4 md:p-8 md:rounded-[2.3rem]">
                    {/* HEADER */}
                    <h2 className="text-base md:text-xl font-black text-zinc-900 mb-4 md:mb-8 flex items-center justify-between border-b-2 border-zinc-100 pb-3 md:pb-5">
                        <span className="text-sm md:text-xl">Sipariş Özeti</span>
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={16} className="text-zinc-700 md:hidden" />
                            <ShoppingBag size={18} className="text-zinc-700 hidden md:block" />
                            <span className="text-[10px] md:text-[11px] font-black bg-zinc-900 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-tighter">
                                {items.length}
                            </span>
                        </div>
                    </h2>

                    {/* PRODUCT LIST */}
                    <div className="space-y-3 md:space-y-6 mb-4 md:mb-8 max-h-[200px] md:max-h-[300px] overflow-auto pr-2 md:pr-3 custom-scrollbar">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 md:gap-5 items-center group"
                            >
                                <div className="w-12 h-14 md:w-16 md:h-20 bg-zinc-50 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 border-2 border-zinc-100 group-hover:border-zinc-300 group-hover:shadow-sm transition-all duration-200">
                                    <img
                                        src={fixImageUrl(item.product.imageUrl)}
                                        alt={item.product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[11px] md:text-[12px] font-black text-zinc-900 truncate uppercase tracking-tight">
                                        {item.product.title}
                                    </h3>
                                    <p className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase">
                                        Adet: {item.quantity}
                                    </p>
                                    <p className="text-[12px] md:text-[13px] font-black text-zinc-900 mt-0.5 md:mt-1">
                                        {item.subtotal.toLocaleString("tr-TR")} TL
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* COUPON SECTION */}
                    <div className="mb-4 md:mb-8">
                        <AnimatePresence mode="wait">
                            {!appliedCoupon ? (
                                <motion.div
                                    key="coupon-input"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="relative"
                                >
                                    <button
                                        onClick={() =>
                                            setIsCouponOpen(!isCouponOpen)
                                        }
                                        className="w-full group"
                                    >
                                        <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-zinc-50 to-white border-2 border-dashed border-zinc-200 rounded-xl md:rounded-2xl hover:border-zinc-300 transition-all duration-200">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md md:shadow-lg shadow-emerald-500/20">
                                                    <TicketPercent className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] md:text-[11px] font-black uppercase tracking-wide text-zinc-900">
                                                        İndirim Kuponu Var mı?
                                                    </p>
                                                    <p className="text-[8px] md:text-[9px] text-zinc-500 font-bold">
                                                        Tıklayın ve kuponu ekleyin
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{
                                                    rotate: isCouponOpen ? 180 : 0,
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className="text-zinc-400 text-xs md:text-sm"
                                            >
                                                ▼
                                            </motion.div>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isCouponOpen && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                    marginTop: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: "auto",
                                                    marginTop: 8,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    height: 0,
                                                    marginTop: 0,
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div className="bg-white border-2 border-zinc-200 rounded-xl md:rounded-2xl p-3 md:p-4">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={couponCode}
                                                            onChange={(e) =>
                                                                setCouponCode(
                                                                    e.target.value.toUpperCase()
                                                                )
                                                            }
                                                            placeholder="KUPON"
                                                            className="flex-1 border-2 border-zinc-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-black uppercase tracking-wider outline-none focus:border-black transition-colors"
                                                        />
                                                        <button
                                                            onClick={onApplyCoupon}
                                                            disabled={
                                                                isCouponLoading ||
                                                                !couponCode.trim()
                                                            }
                                                            className="px-4 md:px-6 bg-black text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 transition-all"
                                                        >
                                                            {isCouponLoading
                                                                ? "..."
                                                                : "UYGULA"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="coupon-applied"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl md:rounded-2xl p-3 md:p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
                                                <Tag className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] md:text-[10px] text-emerald-600 font-bold uppercase">
                                                    Kupon Uygulandı
                                                </p>
                                                <p className="text-xs md:text-sm font-black text-emerald-900 uppercase tracking-wide">
                                                    {appliedCoupon}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onRemoveCoupon}
                                            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center text-emerald-700 transition-colors"
                                        >
                                            <X size={14} className="md:hidden" />
                                            <X size={16} className="hidden md:block" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* PRICE BREAKDOWN */}
                    <div className="space-y-2 md:space-y-4 border-t-2 border-zinc-100 pt-4 md:pt-6">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-600 text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
                                Ara Toplam
                            </span>
                            <span className="font-black text-zinc-900 text-xs md:text-[13px]">
                                {subtotal.toLocaleString("tr-TR")} TL
                            </span>
                        </div>

                        {/* Shipping */}
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-600 text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
                                Kargo
                                {isCalculating && (
                                    <span className="ml-1 md:ml-2 inline text-[8px] md:text-[9px] text-zinc-400">
                                        (hesaplanıyor...)
                                    </span>
                                )}
                            </span>
                            <span
                                className={`font-black text-[10px] md:text-[11px] uppercase ${
                                    shippingFee === 0
                                        ? "text-emerald-700"
                                        : "text-zinc-900"
                                }`}
                            >
                                {shippingFee === 0
                                    ? "Bedava"
                                    : `${shippingFee.toLocaleString(
                                        "tr-TR"
                                    )} TL`}
                            </span>
                        </div>

                        {/* Payment Service Fee */}
                        {paymentServiceFee > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-600 text-[10px] md:text-[11px] font-bold uppercase tracking-widest">
                                    Kapıda Ödeme
                                </span>
                                <span className="font-black text-amber-600 text-[10px] md:text-[11px]">
                                    +{paymentServiceFee.toLocaleString(
                                    "tr-TR"
                                )}{" "}
                                    TL
                                </span>
                            </div>
                        )}

                        {/* Coupon Discount */}
                        {couponDiscount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-between items-center bg-emerald-50 -mx-1 md:-mx-2 px-1 md:px-2 py-1.5 md:py-2 rounded-lg"
                            >
                                <span className="text-emerald-700 text-[10px] md:text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 md:gap-1.5">
                                    <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                    Kupon İndirimi
                                </span>
                                <span className="font-black text-emerald-700 text-xs md:text-[13px]">
                                    -{couponDiscount.toLocaleString(
                                    "tr-TR"
                                )}{" "}
                                    TL
                                </span>
                            </motion.div>
                        )}

                        {/* Payment Discount */}
                        {paymentDiscount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-between items-center bg-blue-50 -mx-1 md:-mx-2 px-1 md:px-2 py-1.5 md:py-2 rounded-lg"
                            >
                                <span className="text-blue-700 text-[10px] md:text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 md:gap-1.5">
                                    <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                    <span className="hidden md:inline">Havale İndirimi</span>
                                    <span className="md:hidden">Havale</span>
                                    {paymentDiscount > 0 && subtotal > 0 && (
                                        <span className="text-[8px] md:text-[9px] bg-blue-600 text-white px-1 md:px-1.5 py-0.5 rounded">
                                            %{((paymentDiscount / subtotal) * 100).toFixed(1)}
                                        </span>
                                    )}
                                </span>
                                <span className="font-black text-blue-700 text-xs md:text-[13px]">
                                    -{paymentDiscount.toLocaleString(
                                    "tr-TR"
                                )}{" "}
                                    TL
                                </span>
                            </motion.div>
                        )}

                        {/* TOTAL */}
                        <div className="mt-4 md:mt-6 bg-gradient-to-br from-zinc-900 to-zinc-600 rounded-xl md:rounded-[1.8rem] p-4 md:p-6 text-white shadow-xl md:shadow-2xl border border-zinc-700">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-zinc-400">
                                    Toplam
                                </span>
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end gap-1 md:gap-1.5">
                                        <span className="text-2xl md:text-3xl font-black tracking-tighter">
                                            {total.toLocaleString("tr-TR")}
                                        </span>
                                        <span className="text-xs md:text-sm font-black text-zinc-300">
                                            TL
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <AnimatePresence>
                {shippingAddress && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-br from-zinc-50 to-white border-2 border-dashed border-zinc-200 p-4 md:p-6 rounded-xl md:rounded-[2rem] shadow-sm"
                    >
                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                            <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-zinc-900">
                                Gönderilecek Adres
                            </h3>
                        </div>
                        <div className="space-y-1 md:space-y-1.5">
                            <p className="text-sm md:text-[15px] font-black text-zinc-900 uppercase tracking-tight">
                                {shippingAddress.firstName}{" "}
                                {shippingAddress.lastName}
                            </p>
                            <div className="text-xs md:text-[13px] text-zinc-700 font-medium leading-relaxed">
                                <p>{shippingAddress.addressLine1}</p>
                                <p className="font-black text-zinc-900 mt-1 md:mt-1.5">
                                    {shippingAddress.district.toUpperCase()} /{" "}
                                    {shippingAddress.city.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}