"use client";
import { Users, TrendingUp, Activity, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { customerService } from "../_services/customerService";

export default function CustomerStats() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await customerService.getStatistics();
            setStats(data);
        } catch (error) {
            console.error("İstatistikler yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-slate-50 border border-slate-100 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const statCards = [
        {
            label: "Toplam Müşteri",
            value: stats.totalCustomers || 0,
            icon: Users,
            color: "text-blue-600 bg-blue-50/50 border-blue-100",
            description: "Kayıtlı kullanıcı"
        },
        {
            label: "Yeni Kayıtlar",
            value: stats.recentRegistrations || 0,
            icon: TrendingUp,
            color: "text-emerald-600 bg-emerald-50/50 border-emerald-100",
            description: "Son 30 gün"
        },
        {
            label: "Aktif Kullanıcı",
            value: stats.activeUsers || 0,
            icon: Activity,
            color: "text-purple-600 bg-purple-50/50 border-purple-100",
            description: "Son 7 gün"
        },
        {
            label: "Etkileşim",
            value: `%${Math.round(stats.engagementRate || 0)}`,
            icon: ShoppingBag,
            color: "text-indigo-600 bg-indigo-50/50 border-indigo-100",
            description: "Aktivite oranı"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {statCards.map((s, i) => (
                <div
                    key={i}
                    className="bg-white border border-slate-100 px-4 py-3 rounded-lg flex items-center justify-between shadow-sm transition-all hover:border-slate-200 hover:shadow-md group cursor-pointer"
                >
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            {s.label}
                        </span>
                        <span className="text-xl font-black text-slate-800 mt-1.5 leading-none font-mono tracking-tight">
                            {s.value}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-wide">
                            {s.description}
                        </span>
                    </div>
                    <div className={`w-10 h-10 rounded-lg border ${s.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <s.icon size={18} strokeWidth={2.5} />
                    </div>
                </div>
            ))}
        </div>
    );
}