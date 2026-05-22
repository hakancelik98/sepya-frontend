"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Package, Users, ShoppingCart, Calendar, RefreshCw } from "lucide-react";
import SalesSection from "./_components/SalesSection";
import InventorySection from "./_components/InventorySection";
import CustomerSection from "./_components/CustomerSection";
import { analyticsService } from "./_services/analyticsService";
import type { DashboardSummaryDTO } from "./_types/dashboard.types";

type DateRangeType = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState<DashboardSummaryDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateRangeType>('month');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchDashboardData = async (
        range: DateRangeType = dateRange,
        startDate?: string,
        endDate?: string
    ) => {
        setLoading(true);
        try {
            const data = await analyticsService.getDashboardSummary(range, startDate, endDate);
            setDashboardData(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Dashboard verileri yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Custom tarih değilse normal fetch
        if (dateRange !== 'custom') {
            fetchDashboardData(dateRange);
        }
        // Custom için fetchDashboardData applyCustomDateRange içinde çağrılıyor
    }, [dateRange]);

    const handleDateRangeChange = (range: DateRangeType) => {
        if (range === 'custom') {
            setDateRange('custom');
            setShowDatePicker(true);
        } else {
            setDateRange(range);
            setShowDatePicker(false);
        }
    };

    const applyCustomDateRange = () => {
        if (!customStartDate || !customEndDate) {
            alert('Lütfen başlangıç ve bitiş tarihlerini seçin');
            return;
        }

        setShowDatePicker(false);
        // Custom tarih ile fetch
        fetchDashboardData('custom', customStartDate, customEndDate);
    };

    const handleRefresh = () => {
        if (dateRange === 'custom' && customStartDate && customEndDate) {
            fetchDashboardData('custom', customStartDate, customEndDate);
        } else {
            fetchDashboardData(dateRange);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-3 border-slate-300 border-t-slate-700 rounded-full mx-auto mb-3" />
                    <p className="text-xs text-slate-500 font-medium">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Safe değer okuma
    const totalRevenue = dashboardData?.sales?.totalRevenue ?? 0;
    const orderCount = dashboardData?.sales?.orderCount ?? 0;
    const averageOrderValue = dashboardData?.sales?.averageOrderValue ?? 0;
    const totalCustomers = dashboardData?.customers?.totalCustomers ?? 0;
    const newCustomersThisMonth = dashboardData?.customers?.newCustomersThisMonth ?? 0;
    const criticalStockCount = dashboardData?.inventory?.criticalStockCount ?? 0;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* HEADER - Compact */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
                                <p className="text-xs text-slate-500 mt-0.5">İşletme Yönetim Paneli</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Date Range Selector */}
                            <div className="relative">
                                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
                                    {(['today', 'week', 'month', 'year', 'all'] as DateRangeType[]).map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => handleDateRangeChange(range)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                                                dateRange === range
                                                    ? 'bg-white text-slate-900 shadow-sm'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            {getDateRangeLabel(range)}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleDateRangeChange('custom')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
                                            dateRange === 'custom'
                                                ? 'bg-white text-slate-900 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Calendar size={12} />
                                        Özel
                                    </button>
                                </div>

                                {/* Custom Date Picker Dropdown */}
                                {showDatePicker && (
                                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 p-4 w-80 z-20">
                                        <p className="text-xs font-semibold text-slate-700 mb-3">Tarih Aralığı Seçin</p>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-slate-600 block mb-1.5">Başlangıç</label>
                                                <input
                                                    type="date"
                                                    value={customStartDate}
                                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-600 block mb-1.5">Bitiş</label>
                                                <input
                                                    type="date"
                                                    value={customEndDate}
                                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={() => setShowDatePicker(false)}
                                                    className="flex-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors"
                                                >
                                                    İptal
                                                </button>
                                                <button
                                                    onClick={applyCustomDateRange}
                                                    className="flex-1 px-3 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                                                >
                                                    Uygula
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Custom Date Display */}
                            {dateRange === 'custom' && customStartDate && customEndDate && (
                                <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                                    {new Date(customStartDate).toLocaleDateString('tr-TR')} - {new Date(customEndDate).toLocaleDateString('tr-TR')}
                                </div>
                            )}

                            {/* Last Updated */}
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400">Son Güncelleme</p>
                                <p className="text-xs font-medium text-slate-700">
                                    {lastUpdated.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                                title="Yenile"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT - Compact Grid */}
            <main className="p-6">
                <div className="max-w-[1600px] mx-auto space-y-4">
                    {/* KPI Cards - 4 columns */}
                    <div className="grid grid-cols-4 gap-4">
                        <KPICard
                            icon={TrendingUp}
                            label="Toplam Gelir"
                            value={`₺${totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                            subValue={`${orderCount} sipariş`}
                            color="emerald"
                        />
                        <KPICard
                            icon={ShoppingCart}
                            label="Ortalama Sepet"
                            value={`₺${averageOrderValue.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`}
                            subValue="sipariş başına"
                            color="blue"
                        />
                        <KPICard
                            icon={Users}
                            label="Toplam Müşteri"
                            value={totalCustomers.toLocaleString('tr-TR')}
                            subValue={`+${newCustomersThisMonth} bu ay`}
                            color="purple"
                        />
                        <KPICard
                            icon={Package}
                            label="Stok Durumu"
                            value={criticalStockCount}
                            subValue="kritik seviye"
                            color={criticalStockCount > 0 ? "red" : "slate"}
                        />
                    </div>

                    {/* Main Grid - 2 columns */}
                    <div className="grid grid-cols-2 gap-4">
                        <SalesSection data={dashboardData?.sales || null} dateRange={dateRange} />
                        <CustomerSection data={dashboardData?.customers || null} dateRange={dateRange} />
                    </div>

                    {/* Full Width Section */}
                    <InventorySection data={dashboardData?.inventory || null} />
                </div>
            </main>
        </div>
    );
}

// KPI Card Component - Compact
interface KPICardProps {
    icon: any;
    label: string;
    value: string | number;
    subValue?: string;
    color: 'emerald' | 'blue' | 'purple' | 'red' | 'slate';
}

function KPICard({ icon: Icon, label, value, subValue, color }: KPICardProps) {
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
        red: 'bg-red-50 text-red-700 border-red-100',
        slate: 'bg-slate-50 text-slate-700 border-slate-100'
    };

    return (
        <div className={`${colorClasses[color]} border rounded-lg p-4 hover:shadow-sm transition-shadow`}>
            <div className="flex items-start justify-between mb-2">
                <Icon size={16} className="opacity-60" />
            </div>
            <p className="text-xs text-slate-600 mb-1">{label}</p>
            <p className="text-xl font-bold mb-0.5">{value}</p>
            {subValue && <p className="text-xs opacity-60">{subValue}</p>}
        </div>
    );
}

function getDateRangeLabel(range: DateRangeType): string {
    const labels: Record<DateRangeType, string> = {
        today: 'Bugün',
        week: 'Hafta',
        month: 'Ay',
        year: 'Yıl',
        all: 'Tümü',
        custom: 'Özel'
    };
    return labels[range];
}