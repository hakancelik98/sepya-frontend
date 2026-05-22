"use client";
import { useState } from "react";
import { Save, AlertTriangle, Zap, Database, Shield, Loader2, Power, Trash2 } from "lucide-react";
import { settingsService } from "../_services/settingsService";

interface SystemSettingsProps {
    settings: any;
    onUpdate: () => void;
}

export default function SystemSettings({ settings, onUpdate }: SystemSettingsProps) {
    const [saving, setSaving] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [formData, setFormData] = useState({
        maintenanceMode: settings?.maintenanceMode ?? false,
        maintenanceMessage: settings?.maintenanceMessage || 'Site bakımda. Lütfen daha sonra tekrar deneyin.',
        cacheEnabled: settings?.cacheEnabled ?? true,
        debugMode: settings?.debugMode ?? false,
        apiRateLimit: settings?.apiRateLimit || 1000,
        maxUploadSizeMb: settings?.maxUploadSizeMb || 10
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateSection('system', formData);
            alert('✅ Sistem ayarları güncellendi!');
            onUpdate();
        } catch (error) {
            alert('❌ Güncelleme başarısız!');
        } finally {
            setSaving(false);
        }
    };

    const handleMaintenanceToggle = async () => {
        const newValue = !formData.maintenanceMode;
        try {
            await settingsService.toggleMaintenanceMode(newValue);
            setFormData({...formData, maintenanceMode: newValue});
            alert(newValue ? '🚧 Bakım modu AÇILDI!' : '✅ Bakım modu KAPATILDI!');
            onUpdate();
        } catch (error) {
            alert('❌ Bakım modu değiştirilemedi!');
        }
    };

    const handleClearCache = async () => {
        if (!confirm('Cache temizlensin mi? Bu işlem performansı geçici olarak etkileyebilir.')) return;

        setClearing(true);
        try {
            await settingsService.clearCache();
            alert('✅ Cache başarıyla temizlendi!');
        } catch (error) {
            alert('❌ Cache temizlenemedi!');
        } finally {
            setClearing(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase">Sistem Ayarları</h2>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Teknik konfigürasyon ve bakım ayarları</p>
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

            {/* Bakım Modu - BÜYÜK UYARI */}
            <div className={`border-2 rounded-xl p-6 ${
                formData.maintenanceMode
                    ? 'bg-red-50 border-red-300'
                    : 'bg-white border-slate-200'
            }`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            formData.maintenanceMode
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-900 text-white'
                        }`}>
                            <Power size={24} />
                        </div>
                        <div>
                            <h3 className={`text-sm font-black uppercase ${
                                formData.maintenanceMode ? 'text-red-900' : 'text-slate-900'
                            }`}>
                                Bakım Modu
                            </h3>
                            <p className={`text-[10px] font-medium mt-1 ${
                                formData.maintenanceMode ? 'text-red-700' : 'text-slate-500'
                            }`}>
                                {formData.maintenanceMode
                                    ? '⚠️ SİTE ŞU AN BAKIM MODUNDA'
                                    : 'Site normal çalışıyor'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleMaintenanceToggle}
                        className={`px-6 py-3 rounded-lg font-black text-sm uppercase transition-all ${
                            formData.maintenanceMode
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                    >
                        {formData.maintenanceMode ? '✓ Bakım Modunu Kapat' : 'Bakım Moduna Al'}
                    </button>
                </div>

                {formData.maintenanceMode && (
                    <div className="mt-4 pt-4 border-t border-red-200">
                        <label className="block text-[10px] font-black text-red-800 uppercase mb-2">
                            Bakım Mesajı
                        </label>
                        <textarea
                            value={formData.maintenanceMessage}
                            onChange={(e) => setFormData({...formData, maintenanceMessage: e.target.value})}
                            rows={2}
                            className="w-full px-4 py-2.5 border-2 border-red-300 rounded-lg text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none bg-white"
                        />
                    </div>
                )}
            </div>

            {/* Performans Ayarları */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <Zap size={16} />
                    Performans
                </h3>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Database size={20} className="text-slate-600" />
                        <div>
                            <p className="text-sm font-black text-slate-900">Cache Sistemi</p>
                            <p className="text-[10px] text-slate-500">Sayfa yükleme hızını artırır</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.cacheEnabled}
                            onChange={(e) => setFormData({...formData, cacheEnabled: e.target.checked})}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>

                <button
                    onClick={handleClearCache}
                    disabled={clearing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg font-black text-sm uppercase hover:bg-orange-700 transition-all disabled:opacity-50"
                >
                    {clearing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    {clearing ? 'Cache Temizleniyor...' : 'Cache Temizle'}
                </button>
            </div>

            {/* Güvenlik & Limitler */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <Shield size={16} />
                    Güvenlik & Limitler
                </h3>

                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={20} className="text-amber-600" />
                        <div>
                            <p className="text-sm font-black text-amber-900">Debug Modu</p>
                            <p className="text-[10px] text-amber-700">⚠️ Sadece development için kullanın!</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.debugMode}
                            onChange={(e) => setFormData({...formData, debugMode: e.target.checked})}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            API Rate Limit (istek/saat)
                        </label>
                        <input
                            type="number"
                            value={formData.apiRateLimit}
                            onChange={(e) => setFormData({...formData, apiRateLimit: parseInt(e.target.value)})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Max Upload (MB)
                        </label>
                        <input
                            type="number"
                            value={formData.maxUploadSizeMb}
                            onChange={(e) => setFormData({...formData, maxUploadSizeMb: parseInt(e.target.value)})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}