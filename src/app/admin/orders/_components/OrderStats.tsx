"use client";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";

export default function OrderStats({ stats }: { stats: any }) {
    const items = [
        { label: "Bekleyen", val: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50/50 border-amber-100" },
        { label: "Hazırlanan", val: stats.preparing, icon: Package, color: "text-blue-600 bg-blue-50/50 border-blue-100" },
        { label: "Kargoda", val: stats.shipped, icon: Truck, color: "text-indigo-600 bg-indigo-50/50 border-indigo-100" },
        { label: "Teslim", val: stats.delivered, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50/50 border-emerald-100" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="bg-white border border-slate-100 px-4 py-2.5 rounded-lg flex items-center justify-between transition-all hover:border-slate-200 shadow-sm"
                >
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            {item.label}
                        </span>
                        <span className="text-base font-black text-slate-800 mt-1 leading-none font-mono">
                            {item.val}
                        </span>
                    </div>
                    <div className={`w-8 h-8 rounded-lg border ${item.color} flex items-center justify-center shrink-0`}>
                        <item.icon size={14} strokeWidth={2.5} />
                    </div>
                </div>
            ))}
        </div>
    );
}