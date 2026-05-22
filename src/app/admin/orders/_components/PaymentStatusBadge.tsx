"use client";

import { PaymentStatus } from "../_types/payment-status.types";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const paymentStatusConfig = {
    [PaymentStatus.PENDING]: {
        label: "ÖDEME BEKLENİYOR",
        class: "bg-amber-50 text-amber-600 border-amber-100",
        icon: Clock
    },
    [PaymentStatus.PAID]: {
        label: "ÖDENDİ",
        class: "bg-emerald-50 text-emerald-600 border-emerald-100",
        icon: CheckCircle
    },
    [PaymentStatus.FAILED]: {
        label: "ÖDEME BAŞARISIZ",
        class: "bg-red-50 text-red-600 border-red-100",
        icon: XCircle
    }
};

export default function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    const config = paymentStatusConfig[status];
    const Icon = config.icon;

    return (
        <span className={`text-[9px] font-black px-2 py-0.5 rounded border tracking-tighter inline-flex items-center gap-1 ${config.class}`}>
            <Icon size={10} />
            {config.label}
        </span>
    );
}