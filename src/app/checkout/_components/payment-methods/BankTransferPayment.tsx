"use client";

import { Building2, CreditCard, User, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface BankInfo {
    bankName?: string;
    bankBranch?: string;
    accountHolder?: string;
    iban?: string;
    accountNumber?: string;
    swiftCode?: string;
}

interface BankTransferPaymentProps {
    discount?: number;
    bankInfo?: BankInfo | null;
}

export default function BankTransferPayment({
                                                discount = 0,
                                                bankInfo = null
                                            }: BankTransferPaymentProps) {
    const [copied, setCopied] = useState(false);

    const formatIBAN = (iban: string) => {
        return iban.replace(/(.{4})/g, '$1 ').trim();
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4 w-full">
            {/* Tek Parça Gri Panel */}
            <div className="py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center px-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm mb-3">
                    <span className="text-2xl">🏦</span>
                </div>

                <h3 className="text-[12px] text-gray-900 font-black uppercase tracking-widest mb-1.5">
                    Havale / EFT
                </h3>

                <p className="text-[10px] text-gray-500 leading-tight mb-4">
                    Aşağıdaki hesap bilgilerimize ödemenizi gerçekleştirin.
                </p>

                {discount > 0 && (
                    <div className="mb-5 bg-green-50 rounded-lg py-2 px-3 border border-green-100 inline-block">
                        <p className="text-[10px] text-green-800 font-bold uppercase tracking-tight">
                            Havale İndirimi: -{discount.toFixed(2)} ₺
                        </p>
                    </div>
                )}

                {/* Banka Detayları - Üstteki yazılarla aynı ölçekte */}
                {bankInfo ? (
                    <div className="space-y-2.5 max-w-sm mx-auto pt-4 border-t border-gray-100">
                        {/* Banka & Alıcı Satırı */}
                        <div className="flex flex-col gap-1.5 text-left">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Building2 size={12} className="shrink-0" />
                                <span className="text-[10px] font-black uppercase text-gray-900 tracking-tight">
                                    {bankInfo.bankName}
                                    {bankInfo.bankBranch && <span className="font-medium text-gray-500 ml-1">({bankInfo.bankBranch})</span>}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                                <User size={12} className="shrink-0" />
                                <span className="text-[10px] font-black uppercase text-gray-900 tracking-tight">
                                    {bankInfo.accountHolder}
                                </span>
                            </div>
                        </div>

                        {/* IBAN Alanı */}
                        <div
                            onClick={() => handleCopy(bankInfo.iban || '')}
                            className="relative flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                <CreditCard size={12} className="text-blue-500" />
                                <span className="text-[11px] font-mono font-black text-blue-900 tracking-wider">
                                    {formatIBAN(bankInfo.iban || '')}
                                </span>
                            </div>
                            {copied ? (
                                <CheckCircle2 size={12} className="text-green-600" />
                            ) : (
                                <Copy size={12} className="text-gray-300 group-hover:text-blue-400" />
                            )}
                        </div>

                        {/* Hesap No & SWIFT (Varsa) */}
                        {(bankInfo.accountNumber || bankInfo.swiftCode) && (
                            <div className="flex justify-start gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-tighter pl-1">
                                {bankInfo.accountNumber && (
                                    <span>No: <span className="text-gray-700">{bankInfo.accountNumber}</span></span>
                                )}
                                {bankInfo.swiftCode && (
                                    <span>Swift: <span className="text-gray-700">{bankInfo.swiftCode}</span></span>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-2">
                        <p className="text-[10px] text-amber-600 font-bold uppercase">⚠️ Banka bilgileri henüz tanımlanmamış.</p>
                    </div>
                )}

                {/* Alt Bilgilendirme */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-1.5">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                        📢 Ödeme açıklamasına sipariş numaranızı yazın Sipariş numaranızı siparişi tamamladıktan sonra görebilirsiniz.
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                        ⏱️ Kontrol süresi: 1-2 iş günü
                    </p>
                </div>
            </div>
        </div>
    );
}