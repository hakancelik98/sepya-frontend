"use client";
import { Loader2, TrendingUp, TrendingDown, CheckCircle2, XCircle } from "lucide-react";

interface EmailStatsProps {
    stats: any;
    loading: boolean;
}

export default function EmailStats({ stats, loading }: EmailStatsProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    const successRate = stats.monthSent > 0
        ? ((stats.monthSent / (stats.monthSent + stats.monthFailed)) * 100).toFixed(1)
        : 0;

    const statCards = [
        {
            title: "Bugün Gönderilen",
            value: stats.todaySent,
            icon: CheckCircle2,
            color: "emerald",
            trend: "+12%"
        },
        {
            title: "Bugün Başarısız",
            value: stats.todayFailed,
            icon: XCircle,
            color: "red",
            trend: "-5%"
        },
        {
            title: "Bu Ay Toplam",
            value: stats.monthSent,
            icon: TrendingUp,
            color: "blue",
            trend: "+25%"
        },
        {
            title: "Aktif Template",
            value: stats.activeTemplates,
            icon: CheckCircle2,
            color: "purple",
            trend: null
        },
        {
            title: "Toplam Template",
            value: stats.totalTemplates,
            icon: CheckCircle2,
            color: "slate",
            trend: null
        },
        {
            title: "Başarı Oranı",
            value: `${successRate}%`,
            icon: TrendingUp,
            color: "amber",
            trend: "+2%"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`bg-white border-2 border-${stat.color}-200 rounded-xl p-6 hover:shadow-xl transition-all group`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                                    <Icon className={`text-${stat.color}-600`} size={24} />
                                </div>
                                {stat.trend && (
                                    <span className={`text-xs font-bold ${
                                        stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                                    }`}>
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                {stat.title}
                            </p>
                            <p className={`text-4xl font-black text-${stat.color}-700 group-hover:scale-110 transition-transform`}>
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase mb-4">
                        Son 7 Gün Gönderim Grafiği
                    </h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                        <p className="text-sm text-slate-400 font-medium">Chart yapımda...</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase mb-4">
                        Template Kullanım Dağılımı
                    </h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                        <p className="text-sm text-slate-400 font-medium">Chart yapımda...</p>
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-sm font-black text-slate-900 uppercase mb-4">
                    Son Aktiviteler
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <p className="text-sm text-slate-700 flex-1">
                                <span className="font-bold">ORDER_PLACED_CUSTOMER</span> template kullanılarak mail gönderildi
                            </p>
                            <span className="text-xs text-slate-400">{i} saat önce</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}