"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Building2, Truck, CreditCard, Copy, Info, CheckCircle2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface BankInfo {
    bankName?: string;
    bankBranch?: string;
    accountHolder?: string;
    iban?: string;
    accountNumber?: string;
    swiftCode?: string;
}

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderNumber, setOrderNumber] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("card");
    const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
    const [copied, setCopied] = useState(false);
    const { clearCart } = useCart();

    useEffect(() => {
        const order = searchParams.get("order");
        if (!order) {
            router.push("/checkout");
            return;
        }

        clearCart();
        setOrderNumber(order);

        const method = searchParams.get("method") || "card";
        setPaymentMethod(method);

        if (method === "bank_transfer") {
            fetch(`${API_URL}/public/finance/calculate-shipping?amount=0&paymentMethod=BANK_TRANSFER`)
                .then(res => res.json())
                .then(data => setBankInfo(data.bankInfo || null))
                .catch(() => setBankInfo(null));
        }
    }, []);

    const formatIBAN = (iban: string) =>
        iban.replace(/(.{4})/g, "$1 ").trim();

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!orderNumber) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black antialiased flex flex-col items-center pt-20 pb-20">
            <div className="max-w-[600px] w-full px-6 text-center space-y-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center"
                >
                    <div className="w-20 h-20 border-2 border-black flex items-center justify-center rounded-full">
                        <Check size={32} strokeWidth={2.5} />
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-400"
                    >
                        {paymentMethod === "bank_transfer" ? "Sipariş Alındı (Ödeme Bekliyor)" : "İşlem Başarılı"}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-light uppercase tracking-tight"
                    >
                        {paymentMethod === "bank_transfer" ? "Neredeyse" : "Teşekkür"}{" "}
                        <span className="italic font-serif">
                            {paymentMethod === "bank_transfer" ? "Hazır." : "Ederiz."}
                        </span>
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                >
                    {paymentMethod === "bank_transfer" ? (
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4 text-left">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                                <Building2 size={20} className="text-blue-600" />
                                <h2 className="text-xs font-black uppercase tracking-widest">Havale Bilgileri</h2>
                            </div>

                            {bankInfo ? (
                                <div className="space-y-3">
                                    {(bankInfo.bankName || bankInfo.bankBranch) && (
                                        <div>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">Banka</p>
                                            <p className="text-sm font-bold">
                                                {bankInfo.bankName}
                                                {bankInfo.bankBranch && (
                                                    <span className="font-normal text-gray-500 ml-1">
                                                        - {bankInfo.bankBranch}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {bankInfo.accountHolder && (
                                        <div>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">Alıcı</p>
                                            <p className="text-sm font-bold uppercase tracking-tight">
                                                {bankInfo.accountHolder}
                                            </p>
                                        </div>
                                    )}

                                    {bankInfo.iban && (
                                        <div
                                            onClick={() => handleCopy(bankInfo.iban!)}
                                            className="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center cursor-pointer hover:border-black transition-all group"
                                        >
                                            <div>
                                                <p className="text-[9px] text-blue-600 font-bold uppercase">IBAN</p>
                                                <p className="text-xs font-mono font-bold tracking-wider text-gray-900">
                                                    {formatIBAN(bankInfo.iban)}
                                                </p>
                                            </div>
                                            {copied ? (
                                                <CheckCircle2 size={16} className="text-green-600" />
                                            ) : (
                                                <Copy size={16} className="text-gray-300 group-hover:text-black" />
                                            )}
                                        </div>
                                    )}

                                    {(bankInfo.accountNumber || bankInfo.swiftCode) && (
                                        <div className="flex gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-tighter pl-1">
                                            {bankInfo.accountNumber && (
                                                <span>No: <span className="text-gray-700">{bankInfo.accountNumber}</span></span>
                                            )}
                                            {bankInfo.swiftCode && (
                                                <span>Swift: <span className="text-gray-700">{bankInfo.swiftCode}</span></span>
                                            )}
                                        </div>
                                    )}

                                    <div className="bg-blue-50 p-3 rounded-lg flex gap-3">
                                        <Info size={16} className="text-blue-600 shrink-0" />
                                        <p className="text-[10px] text-blue-800 leading-tight">
                                            Lütfen açıklama kısmına <strong>#{orderNumber}</strong> yazmayı unutmayın. Ödemeniz onaylandığında siparişiniz işleme alınacaktır.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[10px] text-amber-600 font-bold uppercase py-2">
                                    ⚠️ Banka bilgileri henüz tanımlanmamış.
                                </p>
                            )}
                        </div>
                    ) : paymentMethod === "cod" ? (
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center space-y-3">
                            <Truck size={32} className="text-gray-900" />
                            <h2 className="text-xs font-black uppercase tracking-widest">Kapıda Nakit Ödeme</h2>
                            <p className="text-xs text-gray-600 leading-relaxed max-w-[300px]">
                                Siparişiniz kurye tarafından teslim edilirken ödemeyi yapabilirsiniz.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center space-y-2">
                            <CreditCard size={32} className="text-green-600" />
                            <h2 className="text-xs font-black uppercase tracking-widest">Ödeme Onaylandı</h2>
                            <p className="text-xs text-gray-600">Kredi kartı ile ödemeniz başarıyla gerçekleşti.</p>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="border-y border-gray-100 py-8 space-y-4"
                >
                    <div className="flex justify-between items-center px-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Sipariş No:</span>
                        <span className="font-bold text-sm tracking-widest">#{orderNumber}</span>
                    </div>
                    <div className="flex justify-between items-center px-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Tahmini Teslimat:</span>
                        <span className="font-bold text-sm uppercase">2-4 İş Günü</span>
                    </div>
                </motion.div>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/profile/orders"
                        className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-black/10"
                    >
                        Siparişi Takip Et
                    </Link>

                    <Link
                        href="/"
                        className="w-full text-[10px] font-black uppercase tracking-[0.3em] py-2 text-gray-400 hover:text-black transition"
                    >
                        ← Alışverişe Devam Et
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Yükleniyor...</p>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}