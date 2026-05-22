"use client";
import { useState, useEffect } from "react";
import { Store, Mail, Search, BarChart3, Shield, Settings as SettingsIcon, Globe } from "lucide-react";
import StoreSettings from "./_components/StoreSettings";
import EmailSettings from "./_components/EmailSettings";
import SeoSettings from "./_components/SeoSettings";
import AnalyticsSettings from "./_components/AnalyticsSettings";
import LegalSettings from "./_components/LegalSettings";
import SystemSettings from "./_components/SystemSettings";
import { settingsService } from "./_services/settingsService";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'store' | 'email' | 'seo' | 'analytics' | 'legal' | 'system'>('store');
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await settingsService.getSettings();
            setSettings(data);
        } catch (error) {
            console.error("Ayarlar yüklenirken hata:", error);
            alert("Ayarlar yüklenemedi!");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'store', label: 'Mağaza Bilgileri', icon: Store },
        { id: 'email', label: 'Email & SMTP', icon: Mail },
        { id: 'seo', label: 'SEO Ayarları', icon: Search },
        { id: 'analytics', label: 'Analytics & Tracking', icon: BarChart3 },
        { id: 'legal', label: 'Yasal & Politikalar', icon: Shield },
        { id: 'system', label: 'Sistem Ayarları', icon: SettingsIcon }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden">
            {/* HEADER */}
            <header className="px-8 py-6 border-b border-slate-200 bg-white shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                            Sistem Ayarları
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Mağaza, SEO, email ve genel konfigürasyon
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-2 bg-slate-900 text-white rounded-lg">
                            <p className="text-[9px] font-black uppercase tracking-wider">Son Güncelleme</p>
                            <p className="text-sm font-black font-mono">
                                {settings?.updatedAt
                                    ? new Date(settings.updatedAt).toLocaleDateString('tr-TR')
                                    : 'Bilinmiyor'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* TABS */}
            <div className="border-b border-slate-200 bg-slate-50 px-8 overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
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
                {activeTab === 'store' && <StoreSettings settings={settings} onUpdate={fetchSettings} />}
                {activeTab === 'email' && <EmailSettings settings={settings} onUpdate={fetchSettings} />}
                {activeTab === 'seo' && <SeoSettings settings={settings} onUpdate={fetchSettings} />}
                {activeTab === 'analytics' && <AnalyticsSettings settings={settings} onUpdate={fetchSettings} />}
                {activeTab === 'legal' && <LegalSettings settings={settings} onUpdate={fetchSettings} />}
                {activeTab === 'system' && <SystemSettings settings={settings} onUpdate={fetchSettings} />}
            </main>
        </div>
    );
}