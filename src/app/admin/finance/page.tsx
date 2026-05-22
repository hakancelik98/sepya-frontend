"use client";
import { useState, useEffect } from "react";
import { Tag, Truck, CreditCard } from "lucide-react";
import CouponManager from "./_components/CouponManager";
import ShippingManager from "./_components/ShippingManager";
import PaymentManager from "./_components/PaymentManager";
import { financeService } from "./_services/financeService";

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<'coupons' | 'shipping' | 'payment'>('coupons');
    const [dashboardStats, setDashboardStats] = useState({
        activeCoupons: 0,
        monthlyDiscount: 0,
        totalCouponUsage: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await financeService.getDashboardStats();
                setDashboardStats(stats);
            } catch (error) {
                console.error("Dashboard istatistikleri yüklenemedi:", error);
            }
        };
        fetchStats();
    }, []);

    const tabs = [
        { id: 'coupons', label: 'Kupon Kodları', icon: Tag },
        { id: 'shipping', label: 'Kargo Ayarları', icon: Truck },
        { id: 'payment', label: 'Ödeme Yöntemleri', icon: CreditCard }
    ];

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden">
            {/* HEADER */}
            <header className="px-8 py-6 border-b border-slate-200 bg-white shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                            Finans & Fiyatlandırma
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Kupon, kargo ve ödeme ayarları
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Aktif Kupon</p>
                            <p className="text-lg font-black text-emerald-700 font-mono">{dashboardStats.activeCoupons}</p>
                        </div>
                        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-wider">Bu Ay İndirim</p>
                            <p className="text-lg font-black text-blue-700 font-mono">₺{dashboardStats.monthlyDiscount.toLocaleString('tr-TR')}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* TABS */}
            <div className="border-b border-slate-200 bg-slate-50 px-8">
                <div className="flex gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id
                                    ? 'bg-white text-slate-900 border-b-2 border-slate-900'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT */}
            <main className="flex-1 overflow-auto bg-slate-50 p-8">
                {activeTab === 'coupons' && <CouponManager />}
                {activeTab === 'shipping' && <ShippingManager />}
                {activeTab === 'payment' && <PaymentManager />}
            </main>
        </div>
    );
}