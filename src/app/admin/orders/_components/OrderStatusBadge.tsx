"use client";
import { OrderStatus } from "../_types/order.types";

const statusConfig = {
    [OrderStatus.PENDING]: { label: "BEKLEMEDE", class: "bg-amber-50 text-amber-600 border-amber-100" },
    [OrderStatus.PREPARING]: { label: "HAZIRLANIYOR", class: "bg-blue-50 text-blue-600 border-blue-100" },
    [OrderStatus.SHIPPED]: { label: "KARGODA", class: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    [OrderStatus.DELIVERED]: { label: "TESLİM EDİLDİ", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    [OrderStatus.CANCELLED]: { label: "İPTAL EDİLDİ", class: "bg-slate-100 text-slate-500 border-slate-200" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const config = statusConfig[status];

    return (
        <span className={`text-[9px] font-black px-2 py-0.5 rounded border tracking-tighter inline-block ${config.class}`}>
            {config.label}
        </span>
    );
}