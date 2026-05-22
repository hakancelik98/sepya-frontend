"use client";
import { OrderStatus } from "../_types/order.types";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

export default function StatusUpdateDropdown({ currentStatus, onUpdate }: {
    currentStatus: OrderStatus;
    onUpdate: (status: OrderStatus) => Promise<void>
}) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as OrderStatus;
        if (newStatus === currentStatus) return;
        try {
            setIsUpdating(true);
            await onUpdate(newStatus);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative inline-block w-full max-w-[160px]">
            <select
                value={currentStatus}
                onChange={handleChange}
                disabled={isUpdating}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 text-[10px] font-bold rounded-lg appearance-none cursor-pointer hover:bg-slate-100 transition-all outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 uppercase tracking-wider"
            >
                <option value={OrderStatus.PENDING}>Beklemede</option>
                <option value={OrderStatus.PREPARING}>Hazırlanıyor</option>
                <option value={OrderStatus.SHIPPED}>Kargoda</option>
                <option value={OrderStatus.DELIVERED}>Teslim Edildi</option>
                <option value={OrderStatus.CANCELLED}>İptal Et</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                {isUpdating ? (
                    <Loader2 size={12} className="animate-spin text-blue-500" />
                ) : (
                    <ChevronDown size={12} className="text-slate-400" />
                )}
            </div>
        </div>
    );
}