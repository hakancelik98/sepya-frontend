"use client";
import { useState } from "react";
import { Save, Mail, Server, Key, TestTube, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { settingsService } from "../_services/settingsService";

interface EmailSettingsProps {
    settings: any;
    onUpdate: () => void;
}

export default function EmailSettings({ settings, onUpdate }: EmailSettingsProps) {
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        smtpHost: settings?.smtpHost || '',
        smtpPort: settings?.smtpPort || 587,
        smtpUsername: settings?.smtpUsername || '',
        smtpPassword: settings?.smtpPassword || '',
        smtpFromEmail: settings?.smtpFromEmail || '',
        smtpFromName: settings?.smtpFromName || '',
        smtpUseSsl: settings?.smtpUseSsl ?? true,
        smtpUseTls: settings?.smtpUseTls ?? false
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateSection('email', formData);
            alert('✅ Email ayarları başarıyla güncellendi!');
            onUpdate();
        } catch (error) {
            alert('❌ Güncelleme başarısız!');
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const result = await settingsService.testSmtp(formData);
            setTestResult(result);
        } catch (error) {
            setTestResult({ success: false, message: 'Test sırasında hata oluştu' });
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase">Email & SMTP Ayarları</h2>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Mail gönderim konfigürasyonu</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleTest}
                        disabled={testing}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-[11px] font-black uppercase hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                    >
                        {testing ? <Loader2 size={14} className="animate-spin" /> : <TestTube size={14} />}
                        {testing ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {/* Test Result */}
            {testResult && (
                <div className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
                    testResult.success
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-red-50 border-red-200'
                }`}>
                    {testResult.success ? (
                        <CheckCircle2 className="text-emerald-600" size={20} />
                    ) : (
                        <AlertCircle className="text-red-600" size={20} />
                    )}
                    <div>
                        <p className={`text-sm font-bold ${testResult.success ? 'text-emerald-900' : 'text-red-900'}`}>
                            {testResult.message}
                        </p>
                    </div>
                </div>
            )}

            {/* SMTP Server Ayarları */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <Server size={16} />
                    SMTP Sunucu Bilgileri
                </h3>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            SMTP Host *
                        </label>
                        <input
                            type="text"
                            value={formData.smtpHost}
                            onChange={(e) => setFormData({...formData, smtpHost: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="smtp.gmail.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Port *
                        </label>
                        <input
                            type="number"
                            value={formData.smtpPort}
                            onChange={(e) => setFormData({...formData, smtpPort: parseInt(e.target.value)})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="587"
                        />
                        <p className="text-[9px] text-slate-400 mt-1">Genellikle: 587 (TLS) veya 465 (SSL)</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Kullanıcı Adı *
                        </label>
                        <input
                            type="text"
                            value={formData.smtpUsername}
                            onChange={(e) => setFormData({...formData, smtpUsername: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Şifre *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.smtpPassword}
                                onChange={(e) => setFormData({...formData, smtpPassword: e.target.value})}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-all flex-1">
                        <input
                            type="checkbox"
                            checked={formData.smtpUseSsl}
                            onChange={(e) => setFormData({...formData, smtpUseSsl: e.target.checked})}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600"
                        />
                        <div>
                            <p className="text-sm font-black text-slate-900">SSL Kullan</p>
                            <p className="text-[9px] text-slate-500">Port 465 için</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-all flex-1">
                        <input
                            type="checkbox"
                            checked={formData.smtpUseTls}
                            onChange={(e) => setFormData({...formData, smtpUseTls: e.target.checked})}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600"
                        />
                        <div>
                            <p className="text-sm font-black text-slate-900">TLS Kullan</p>
                            <p className="text-[9px] text-slate-500">Port 587 için</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Gönderen Bilgileri */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <Mail size={16} />
                    Gönderen Bilgileri
                </h3>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Gönderen Email *
                        </label>
                        <input
                            type="email"
                            value={formData.smtpFromEmail}
                            onChange={(e) => setFormData({...formData, smtpFromEmail: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="noreply@sepya.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Gönderen Adı *
                        </label>
                        <input
                            type="text"
                            value={formData.smtpFromName}
                            onChange={(e) => setFormData({...formData, smtpFromName: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="Sepya Store"
                        />
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-[10px] text-blue-800 font-medium">
                        <strong>Önizleme:</strong> Müşteriler emaili "{formData.smtpFromName || 'Sepya Store'} &lt;{formData.smtpFromEmail || 'noreply@sepya.com'}&gt;" olarak görecekler.
                    </p>
                </div>
            </div>

            {/* Popüler SMTP Sağlayıcıları */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h4 className="text-[10px] font-black text-slate-600 uppercase mb-4">Popüler SMTP Sağlayıcıları</h4>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => setFormData({
                            ...formData,
                            smtpHost: 'smtp.gmail.com',
                            smtpPort: 587,
                            smtpUseTls: true,
                            smtpUseSsl: false
                        })}
                        className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-500 transition-all text-left"
                    >
                        <p className="text-sm font-bold text-slate-900">Gmail</p>
                        <p className="text-[9px] text-slate-500">smtp.gmail.com:587</p>
                    </button>
                    <button
                        onClick={() => setFormData({
                            ...formData,
                            smtpHost: 'smtp.office365.com',
                            smtpPort: 587,
                            smtpUseTls: true,
                            smtpUseSsl: false
                        })}
                        className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-500 transition-all text-left"
                    >
                        <p className="text-sm font-bold text-slate-900">Outlook</p>
                        <p className="text-[9px] text-slate-500">smtp.office365.com:587</p>
                    </button>
                    <button
                        onClick={() => setFormData({
                            ...formData,
                            smtpHost: 'smtp.sendgrid.net',
                            smtpPort: 587,
                            smtpUseTls: true,
                            smtpUseSsl: false
                        })}
                        className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-500 transition-all text-left"
                    >
                        <p className="text-sm font-bold text-slate-900">SendGrid</p>
                        <p className="text-[9px] text-slate-500">smtp.sendgrid.net:587</p>
                    </button>
                </div>
            </div>
        </div>
    );
}