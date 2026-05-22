// app/checkout/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ShippingForm from "@/app/checkout/_components/ShippingForm";
import PaymentForm from "@/app/checkout/_components/PaymentForm";
import CheckoutSummary from "@/app/checkout/_components/CheckoutSummary";
import { useCart } from "@/app/checkout/_hooks/useCart";
import { useCheckout } from "@/app/checkout/_hooks/useCheckout";
import AuthStep from "@/app/checkout/_components/AuthStep";
import { financeService } from "@/app/checkout/_services/checkoutService";
import type { PaymentMethodType } from "@/lib/types/checkout";
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";

const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, isLoading: cartLoading } = useCart();

    // AUTH STATES
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<number | null>(null); // ✅ YENİ
    const [guestStarted, setGuestStarted] = useState(false);
    const [guestEmail, setGuestEmail] = useState("");

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("CREDIT_CARD");

    const [financeData, setFinanceData] = useState({
        shippingPrice: 0,
        codFee: 0,
        transferDiscount: 0,
    });

    // CHECKOUT STATES
    const {
        currentStep,
        shippingAddress,
        shippingFee,
        paymentServiceFee,
        paymentDiscount,
        couponDiscount,
        isProcessing,
        error,
        total,
        handleShippingSubmit,
        handleTotalsUpdate,
        handleCouponUpdate,
        handlePaymentSubmit,
        handleBackToShipping,
        setError,
    } = useCheckout({
        cartItems: cart?.items || [],
        cartSubtotal: cart?.totalPrice || 0,
    });

    // COUPON STATES
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponCode, setCouponCode] = useState("");
    const [isCouponLoading, setIsCouponLoading] = useState(false);

    const hasCheckedAuth = useRef(false);

    useEffect(() => {
        if (hasCheckedAuth.current) return;
        const token = localStorage.getItem("token");
        const userDataJson = localStorage.getItem("user"); // ✅ YENİ
        if (cartLoading) return;
        hasCheckedAuth.current = true;
        if (token) {
            setIsLoggedIn(true);
            // ✅ YENİ: userId'yi parse et
            if (userDataJson) {
                try {
                    const userData = JSON.parse(userDataJson);
                    setUserId(userData.id || null);
                } catch (e) {
                    console.error("User data parse hatası:", e);
                }
            }
        }
    }, [cartLoading]);

    useEffect(() => {
        if (cart?.totalPrice && cart.totalPrice > 0) {
            loadFinanceData("CREDIT_CARD");
        }
    }, [cart?.totalPrice]);

    const loadFinanceData = async (paymentMethod: PaymentMethodType) => {
        try {
            const res = await financeService.calculateShipping(
                cart?.totalPrice || 0,
                paymentMethod
            );

            setFinanceData({
                shippingPrice: res.shippingPrice || 0,
                codFee: res.extraFee || 0,
                transferDiscount: res.discount || 0,
            });

            handleTotalsUpdate({
                shippingFee: res.shippingPrice || 0,
                paymentServiceFee: res.extraFee || 0,
                paymentDiscount: res.discount || 0,
            });

            setSelectedPaymentMethod(paymentMethod);
        } catch (error) {
            console.error("Finance yükleme hatası:", error);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setError("Lütfen kupon kodunu giriniz");
            return;
        }

        setIsCouponLoading(true);
        setError(null);

        try {
            // ✅ YENİ: userId'yi kupon validasyonuna gönder
            const res = await financeService.validateCoupon(
                couponCode,
                cart?.totalPrice || 0,
                userId // Guest ise null, üye ise userId
            );
            handleCouponUpdate(res.discount || 0);
            setAppliedCoupon(couponCode);
            setIsCouponOpen(false);
        } catch (err: any) {
            setError(err.message || "Kupon geçersiz veya süresi dolmuş");
            setAppliedCoupon(null);
        } finally {
            setIsCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        handleCouponUpdate(0);
        setIsCouponOpen(false);
    };

    if (cartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-16 md:pt-20">
                <div className="max-w-md w-full text-center space-y-6 md:space-y-8 py-12 md:py-16">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-zinc-50 rounded-full flex items-center justify-center border-2 border-zinc-100">
                        <ShoppingBag size={32} className="text-zinc-300 md:hidden" />
                        <ShoppingBag size={40} className="text-zinc-300 hidden md:block" />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900">
                            Sepetiniz Boş
                        </h2>
                        <p className="text-xs md:text-sm text-zinc-500 font-medium">
                            Ödeme yapabilmek için sepetinize ürün ekleyin
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-black text-white py-4 md:py-5 rounded-xl md:rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                    >
                        Alışverişe Başla
                    </button>
                </div>
            </div>
        );
    }

    if (!isLoggedIn && !guestStarted) {
        return (
            <AuthStep
                guestEmail={guestEmail}
                setGuestEmail={setGuestEmail}
                error={error}
                onGuestContinue={() => {
                    if (!guestEmail || !isValidEmail(guestEmail)) {
                        setError("Lütfen geçerli bir e-posta adresi giriniz");
                        return;
                    }
                    setGuestStarted(true);
                    setError(null);
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white pt-12 md:pt-16 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-4">
                {/* HEADER */}
                <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
                            Ödeme Adımı
                        </h1>
                        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                            <div
                                className={`flex items-center gap-1.5 md:gap-2 ${
                                    currentStep === "shipping" ? "text-black" : "text-zinc-300"
                                }`}
                            >
                                <span
                                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[9px] md:text-[10px] ${
                                        currentStep === "shipping"
                                            ? "bg-black text-white"
                                            : "bg-zinc-100"
                                    }`}
                                >
                                    1
                                </span>
                                <span className="inline text-[9px] md:text-[11px]">Teslimat</span>
                            </div>
                            <div className="w-6 md:w-8 h-[2px] bg-zinc-100"></div>
                            <div
                                className={`flex items-center gap-1.5 md:gap-2 ${
                                    currentStep === "payment" ? "text-black" : "text-zinc-300"
                                }`}
                            >
                                <span
                                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[9px] md:text-[10px] ${
                                        currentStep === "payment"
                                            ? "bg-black text-white"
                                            : "bg-zinc-100"
                                    }`}
                                >
                                    2
                                </span>
                                <span className="inline text-[9px] md:text-[11px]">Ödeme & Onay</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 md:mb-8 bg-red-50 border-l-4 border-red-600 p-4 md:p-5 shadow-sm rounded"
                    >
                        <div className="flex items-center gap-3 md:gap-4">
                            <span className="bg-red-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-bold text-xs">
                                !
                            </span>
                            <div className="flex-1">
                                <h3 className="font-black text-red-900 text-[10px] md:text-xs uppercase tracking-widest">
                                    İşlem Hatası
                                </h3>
                                <p className="text-red-700 text-xs md:text-[13px] font-medium mt-0.5">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-900 font-bold px-2"
                            >
                                ✕
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* MAIN GRID */}
                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">

                    {/* ÖZET KISMI (Mobilde en üstte görünür) */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="space-y-4 md:space-y-6">
                            <CheckoutSummary
                                items={cart?.items || []}
                                subtotal={cart?.totalPrice || 0}
                                shippingFee={shippingFee}
                                paymentServiceFee={paymentServiceFee}
                                paymentDiscount={paymentDiscount}
                                couponDiscount={couponDiscount}
                                total={total}
                                isCouponOpen={isCouponOpen}
                                setIsCouponOpen={setIsCouponOpen}
                                appliedCoupon={appliedCoupon}
                                couponCode={couponCode}
                                setCouponCode={setCouponCode}
                                onApplyCoupon={handleApplyCoupon}
                                onRemoveCoupon={removeCoupon}
                                isCouponLoading={isCouponLoading}
                                isCalculating={false}
                                shippingAddress={currentStep === "payment" ? shippingAddress : null}
                                codFee={financeData.codFee}
                                transferDiscount={financeData.transferDiscount}
                                paymentMethod={selectedPaymentMethod}
                            />
                        </div>
                    </div>

                    {/* FORM KISMI (Mobilde özetin altına düşer) */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <AnimatePresence mode="wait">
                            {currentStep === "shipping" ? (
                                <motion.div
                                    key="shipping"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <ShippingForm
                                        onSubmit={handleShippingSubmit}
                                        initialData={shippingAddress}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="mb-6 md:mb-10">
                                        <button
                                            onClick={() => handleBackToShipping()}
                                            className="group flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-black uppercase text-zinc-400 hover:text-black transition-colors"
                                        >
                                            <ArrowLeft
                                                size={12}
                                                className="group-hover:-translate-x-1 transition-transform md:hidden"
                                            />
                                            <ArrowLeft
                                                size={14}
                                                className="group-hover:-translate-x-1 transition-transform hidden md:block"
                                            />
                                            <span className="hidden sm:inline">Adres Bilgilerini Düzenle</span>
                                            <span className="sm:hidden">Adres Düzenle</span>
                                        </button>
                                    </div>
                                    <PaymentForm
                                        cartTotal={cart?.totalPrice || 0}
                                        onSuccess={handlePaymentSubmit}
                                        onBack={() => handleBackToShipping()}
                                        onTotalsUpdate={handleTotalsUpdate}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* LOADING OVERLAY */}
            {isProcessing && (
                <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center z-50 px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl md:rounded-[3rem] p-8 md:p-12 text-center shadow-2xl max-w-sm mx-4"
                    >
                        <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6">
                            <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="font-black text-xl md:text-2xl uppercase tracking-tighter text-zinc-900">
                            Güvenli İşlem
                        </p>
                        <p className="text-[10px] md:text-[11px] text-zinc-500 mt-2 md:mt-3 uppercase tracking-[0.2em] font-bold leading-relaxed">
                            Banka onayı bekleniyor, lütfen bu sayfadan ayrılmayın.
                        </p>
                    </motion.div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                @media (min-width: 768px) {
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e4e4e7;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #27272a;
                }
            `}</style>
        </div>
    );
}