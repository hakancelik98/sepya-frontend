"use client";
import { TrendingUp, DollarSign, ShoppingBag } from "lucide-react";

interface SalesSectionProps {
    data: {
        totalRevenue: number;
        orderCount: number;
        averageOrderValue: number;
    } | null;
    dateRange: string;
}

export default function SalesSection({ data, dateRange }: SalesSectionProps) {
    if (!data) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
                <p className="text-center text-xs text-slate-400">Veri yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 rounded">
                        <TrendingUp size={14} className="text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Satış Özeti</h3>
                </div>
                <span className="text-xs text-slate-500">{getDateRangeLabel(dateRange)}</span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Toplam Gelir */}
                <div>
                    <p className="text-xs text-slate-600 mb-1">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-slate-900">
                        ₺{data.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <MetricBox
                        icon={ShoppingBag}
                        label="Toplam Sipariş"
                        value={data.orderCount.toLocaleString('tr-TR')}
                        bgColor="bg-blue-50"
                    />
                    <MetricBox
                        icon={DollarSign}
                        label="Ort. Sipariş"
                        value={`₺${data.averageOrderValue.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`}
                        bgColor="bg-purple-50"
                    />
                </div>
            </div>
        </div>
    );
}

interface MetricBoxProps {
    icon: any;
    label: string;
    value: string;
    bgColor: string;
}

function MetricBox({ icon: Icon, label, value, bgColor }: MetricBoxProps) {
    return (
        <div className={`${bgColor} rounded-lg p-3`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon size={12} className="text-slate-600" />
                <span className="text-xs text-slate-600">{label}</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{value}</p>
        </div>
    );
}

function getDateRangeLabel(range: string): string {
    const labels: Record<string, string> = {
        today: 'Bugün',
        week: 'Bu Hafta',
        month: 'Bu Ay',
        year: 'Bu Yıl',
        all: 'Tüm Zamanlar',
        custom: 'Özel Tarih'
    };
    return labels[range] || 'Tümü';
}