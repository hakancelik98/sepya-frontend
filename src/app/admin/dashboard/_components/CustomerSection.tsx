"use client";
import { Users, UserPlus, Target } from "lucide-react";

interface CustomerSectionProps {
    data: {
        totalCustomers: number;
        newCustomersThisMonth: number;
        conversionRate: number;
    } | null;
    dateRange: string;
}

export default function CustomerSection({ data, dateRange }: CustomerSectionProps) {
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
                    <div className="p-1.5 bg-purple-50 rounded">
                        <Users size={14} className="text-purple-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Müşteri Analizi</h3>
                </div>
                <span className="text-xs text-slate-500">{getDateRangeLabel(dateRange)}</span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Toplam Müşteri */}
                <div>
                    <p className="text-xs text-slate-600 mb-1">Toplam Müşteri</p>
                    <p className="text-2xl font-bold text-slate-900">
                        {data.totalCustomers.toLocaleString('tr-TR')}
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-pink-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <UserPlus size={12} className="text-pink-600" />
                            <span className="text-xs text-slate-600">Yeni Müşteri</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                            +{data.newCustomersThisMonth.toLocaleString('tr-TR')}
                        </p>
                        <p className="text-xs text-pink-600 mt-1">Bu ay</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={12} className="text-blue-600" />
                            <span className="text-xs text-slate-600">Dönüşüm</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                            %{data.conversionRate.toFixed(1)}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">Oran</p>
                    </div>
                </div>
            </div>
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