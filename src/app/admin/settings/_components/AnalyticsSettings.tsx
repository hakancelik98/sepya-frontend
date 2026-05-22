"use client";
import { useState } from "react";
import { Save, BarChart3, TrendingUp, Eye, Loader2 } from "lucide-react";
import { settingsService } from "../_services/settingsService";

interface AnalyticsSettingsProps {
    settings: any;
    onUpdate: () => void;
}

export default function AnalyticsSettings({ settings, onUpdate }: AnalyticsSettingsProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        googleAnalyticsId: settings?.googleAnalyticsId || '',
        googleTagManagerId: settings?.googleTagManagerId || '',
        facebookPixelId: settings?.facebookPixelId || '',
        googleSearchConsole: settings?.googleSearchConsole || '',
        hotjarId: settings?.hotjarId || ''
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateSection('analytics', formData);
            alert('✅ Analytics ayarları güncellendi!');
            onUpdate();
        } catch (error) {
            alert('❌ Güncelleme başarısız!');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase">Analytics & Tracking</h2>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Ziyaretçi takibi ve analytics entegrasyonları</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {/* Google Analytics */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <BarChart3 size={16} />
                    Google Analytics
                </h3>
                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                        Google Analytics ID (GA4)
                    </label>
                    <input
                        type="text"
                        value={formData.googleAnalyticsId}
                        onChange={(e) => setFormData({...formData, googleAnalyticsId: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="G-XXXXXXXXXX"
                    />
                </div>
            </div>

            {/* Google Tag Manager */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Google Tag Manager
                </h3>
                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                        GTM Container ID
                    </label>
                    <input
                        type="text"
                        value={formData.googleTagManagerId}
                        onChange={(e) => setFormData({...formData, googleTagManagerId: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="GTM-XXXXXXX"
                    />
                </div>
            </div>

            {/* Facebook Pixel & Other */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3">
                    Diğer Tracking Araçları
                </h3>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Facebook Pixel ID
                        </label>
                        <input
                            type="text"
                            value={formData.facebookPixelId}
                            onChange={(e) => setFormData({...formData, facebookPixelId: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="1234567890123456"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Hotjar Site ID
                        </label>
                        <input
                            type="text"
                            value={formData.hotjarId}
                            onChange={(e) => setFormData({...formData, hotjarId: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="1234567"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                        Google Search Console Doğrulama Kodu
                    </label>
                    <input
                        type="text"
                        value={formData.googleSearchConsole}
                        onChange={(e) => setFormData({...formData, googleSearchConsole: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="<meta name='google-site-verification' content='...' />"
                    />
                </div>
            </div>
        </div>
    );
}