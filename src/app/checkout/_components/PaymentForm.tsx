"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePaymentForm } from "@/app/checkout/_hooks/usePaymentForm";
import PaymentMethodSelector from "@/app/checkout/_components/PaymentMethodSelector";
import CreditCardPayment from "@/app/checkout/_components/payment-methods/CreditCardPayment";
import CashOnDeliveryPayment from "@/app/checkout/_components/payment-methods/CashOnDeliveryPayment";
import BankTransferPayment from "@/app/checkout/_components/payment-methods/BankTransferPayment";
import type { PaymentMethod, PaymentMethodType } from "@/lib/types/checkout";
import { financeService } from "@/app/checkout/_services/checkoutService";

interface BankInfo {
    bankName?: string;
    bankBranch?: string;
    accountHolder?: string;
    iban?: string;
    accountNumber?: string;
    swiftCode?: string;
}

interface PaymentFormProps {
    cartTotal: number;
    onSuccess: (paymentMethod: PaymentMethod) => void;
    onBack: () => void;
    onTotalsUpdate: (data: {
        shippingFee: number;
        paymentServiceFee: number;
        paymentDiscount: number;
    }) => void;
}

export default function PaymentForm({
                                        cartTotal,
                                        onSuccess,
                                        onBack,
                                        onTotalsUpdate,
                                    }: PaymentFormProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("CREDIT_CARD");

    const [financeData, setFinanceData] = useState({
        shippingPrice: 0,
        codFee: 0,
        transferDiscount: 0,
        bankInfo: null as BankInfo | null,
    });

    // ✅ TEK usePaymentForm instance — sadece burada, CreditCardPayment'ta YOK
    const {
        formData,
        errors,
        touched,
        isSubmitting,
        isValid,
        cardBrand,
        handleChange,
        handleBlur,
        handleSubmit,
    } = usePaymentForm();

    // ==========================================
    // ÖDEME YÖNTEMİ DEĞİŞTİĞİNDE KARGO HESAPLAMASI
    // ==========================================
    const handleMethodChange = useCallback(
        async (method: PaymentMethodType) => {
            setSelectedMethod(method);

            try {
                const res = await financeService.calculateShipping(cartTotal, method);

                setFinanceData({
                    shippingPrice: res.shippingPrice || 0,
                    codFee: res.extraFee || 0,
                    transferDiscount: res.discount || 0,
                    bankInfo: res.bankInfo || null,
                });

                onTotalsUpdate({
                    shippingFee: res.shippingPrice || 0,
                    paymentServiceFee: res.extraFee || 0,
                    paymentDiscount: res.discount || 0,
                });
            } catch (error) {
                console.error("Kargo hesaplama hatası:", error);
                setFinanceData({ shippingPrice: 0, codFee: 0, transferDiscount: 0, bankInfo: null });
                onTotalsUpdate({ shippingFee: 0, paymentServiceFee: 0, paymentDiscount: 0 });
            }
        },
        // ✅ cartTotal dependency eklendi — tutar değişirse yeniden hesaplanır
        [cartTotal, onTotalsUpdate]
    );

    // ✅ cartTotal dependency'e eklendi
    useEffect(() => {
        if (cartTotal > 0) {
            handleMethodChange("CREDIT_CARD");
        }
    }, [cartTotal, handleMethodChange]);

    // ==========================================
    // FORM SUBMIT
    // ==========================================
    const handleFinalSubmit = () => {
        if (selectedMethod === "CREDIT_CARD") {
            // ✅ handleSubmit buradaki formData'yı kullanıyor — CreditCardPayment'ın değil
            handleSubmit(onSuccess);
        } else {
            onSuccess({
                type: selectedMethod,
                cardDetails: null as any,
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-2xl font-black text-gray-900 uppercase tracking-tighter">
                Ödeme Yöntemi Seçin
                <span className="inline-block px-3 py-1 text-[13px] font-black tracking-normal normal-case text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full shadow-[0_2px_10px_rgba(239,68,68,0.3)] animate-pulse">
                    Havale / EFT %5 İndirim!
                </span>
            </h2>

            <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onMethodChange={handleMethodChange}
                codFee={financeData.codFee}
                transferDiscount={financeData.transferDiscount}
                shippingPrice={financeData.shippingPrice}
            />

            {/* PAYMENT METHOD FORMS
              * AnimatePresence'a her zaman tek bir child geçiliyor.
              * key değişince exit → enter animasyonu tetiklenir.
              * DOM removeChild hatası önlenir.
              */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedMethod}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.15 }}
                >
                    {selectedMethod === "CREDIT_CARD" && (
                        <CreditCardPayment
                            formData={formData}
                            errors={errors}
                            touched={touched}
                            isValid={isValid}
                            cardBrand={cardBrand}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                        />
                    )}
                    {selectedMethod === "COD" && (
                        <CashOnDeliveryPayment serviceFee={financeData.codFee} />
                    )}
                    {selectedMethod === "BANK_TRANSFER" && (
                        <BankTransferPayment
                            discount={financeData.transferDiscount}
                            bankInfo={financeData.bankInfo}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* SUBMIT BUTTONS */}
            <div className="space-y-4 pt-4">
                <button
                    onClick={handleFinalSubmit}
                    disabled={
                        (selectedMethod === "CREDIT_CARD" && !isValid) || isSubmitting
                    }
                    className="w-full bg-black text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-[0.98] shadow-xl shadow-zinc-200"
                >
                    {isSubmitting ? "İŞLENİYOR..." : "SİPARİŞİ TAMAMLA"}
                </button>
                <button
                    onClick={onBack}
                    className="w-full text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors tracking-widest"
                >
                    ← TESLİMAT BİLGİLERİNE DÖN
                </button>
            </div>
        </div>
    );
}