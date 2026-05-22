// app/checkout/_components/PaymentMethodSelector.tsx

"use client";

import { CreditCard, Banknote, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export type PaymentMethodType = "CREDIT_CARD" | "COD" | "BANK_TRANSFER";

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethodType;
    onMethodChange: (method: PaymentMethodType) => void;
    codFee?: number;
    transferDiscount?: number;
    shippingPrice?: number;
}

export default function PaymentMethodSelector({
                                                  selectedMethod,
                                                  onMethodChange,
                                                  codFee = 0,
                                                  transferDiscount = 0,
                                                  shippingPrice = 0,
                                              }: PaymentMethodSelectorProps) {
    const getMethods = () => [
        {
            id: "CREDIT_CARD" as PaymentMethodType,
            title: "Kredi/Banka Kartı",
            icon: CreditCard,
            description: `256-bit SSL ile güvenli ödeme${
                shippingPrice > 0
                    ? ` (Kargo: ${shippingPrice.toFixed(2)} TL)`
                    : " (Ücretsiz kargo)"
            }`,
            color: "from-blue-500 to-blue-600",
        },
        {
            id: "COD" as PaymentMethodType,
            title: "Kapıda Ödeme",
            icon: Banknote,
            description: `Kapıda nakit veya kartla${
                codFee > 0
                    ? ` (Hizmet bedeli: +${codFee.toFixed(2)} TL)`
                    : ""
            }`,
            color: "from-amber-500 to-amber-600",
        },
        {
            id: "BANK_TRANSFER" as PaymentMethodType,
            title: "Havale / EFT",
            icon: Building2,
            description: `Banka bilgileri e-posta ile gönderilir${
                transferDiscount > 0
                    ? ` (İndirim: ${transferDiscount.toFixed(2)} TL)`
                    : ""
            }`,
            color: "from-emerald-500 to-emerald-600",
        },
    ];

    const methods = getMethods();

    return (
        <div className="space-y-2 md:space-y-3">
            {methods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                    <motion.button
                        key={method.id}
                        onClick={() => onMethodChange(method.id)}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        className={`w-full text-left transition-all duration-300 ${
                            isSelected
                                ? "border-black bg-black/5 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                        } border-2 rounded-xl md:rounded-2xl p-3 md:p-2`}
                    >
                        <div className="flex items-center gap-3 md:gap-4">
                            {/* Radio Button */}
                            <div
                                className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    isSelected
                                        ? "border-black bg-black"
                                        : "border-gray-300"
                                }`}
                            >
                                {isSelected && (
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
                                )}
                            </div>

                            {/* Icon */}
                            <div
                                className={`w-7 h-7 md:w-8 md:h-8 rounded-md bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0 text-white shadow-sm`}
                            >
                                <Icon size={14} className="md:hidden" />
                                <Icon size={16} className="hidden md:block" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-[11px] md:text-[12px] uppercase tracking-tight text-gray-900 leading-none">
                                    {method.title}
                                </h3>
                                <p className="text-[10px] md:text-[11px] text-gray-500 font-medium mt-0.5 leading-tight truncate">
                                    {method.description}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}