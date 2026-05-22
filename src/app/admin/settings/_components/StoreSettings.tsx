"use client";
import { useState, useRef } from "react";
import { Save, Upload, MapPin, Phone, Mail, Clock, Loader2, Image as ImageIcon } from "lucide-react";
import { settingsService } from "../_services/settingsService";

interface StoreSettingsProps {
    settings: any;
    onUpdate: () => void;
}

export default function StoreSettings({ settings, onUpdate }: StoreSettingsProps) {
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<'logo' | 'favicon' | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    const [formData, setFormData] = useState({
        siteName: settings?.siteName || '',
        siteTitle: settings?.siteTitle || '',
        siteDescription: settings?.siteDescription || '',
        logoUrl: settings?.logoUrl || '',
        faviconUrl: settings?.faviconUrl || '',
        contactEmail: settings?.contactEmail || '',
        contactPhone: settings?.contactPhone || '',
        contactAddress: settings?.contactAddress || '',
        businessHours: settings?.businessHours || ''
    });

    const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
        setUploading(type);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const response = await fetch(`${API_BASE}/admin/settings/upload-image`, {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();

            if (type === 'logo') {
                setFormData(prev => ({ ...prev, logoUrl: data.url }));
            } else {
                setFormData(prev => ({ ...prev, faviconUrl: data.url }));
            }

            alert(`✅ ${type === 'logo' ? 'Logo' : 'Favicon'} başarıyla yüklendi!`);
        } catch (error) {
            alert(`❌ ${type === 'logo' ? 'Logo' : 'Favicon'} yüklenemedi!`);
            console.error('Upload error:', error);
        } finally {
            setUploading(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateSection('store', formData);
            alert('✅ Mağaza bilgileri başarıyla güncellendi!');
            onUpdate();
        } catch (error) {
            alert('❌ Güncelleme başarısız!');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase">Mağaza Bilgileri</h2>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Site adı, logo ve iletişim bilgileri</p>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            {/* Temel Bilgiler */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3">
                    Temel Bilgiler
                </h3>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Site Adı *
                        </label>
                        <input
                            type="text"
                            value={formData.siteName}
                            onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="Sepya Store"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Site Başlığı (Title) *
                        </label>
                        <input
                            type="text"
                            value={formData.siteTitle}
                            onChange={(e) => setFormData({...formData, siteTitle: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="Sepya - Premium E-Commerce"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                        Site Açıklaması
                    </label>
                    <textarea
                        value={formData.siteDescription}
                        onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                        placeholder="Kaliteli ürünler, hızlı teslimat..."
                    />
                </div>
            </div>

            {/* Logo & Favicon */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <ImageIcon size={16} />
                    Logo & Favicon
                </h3>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Logo URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.logoUrl}
                                onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="https://..."
                            />
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleFileUpload(file, 'logo');
                                        // Reset input so same file can be selected again
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    logoInputRef.current?.click();
                                }}
                                disabled={uploading === 'logo'}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                                title="Logo yükle"
                            >
                                {uploading === 'logo' ? (
                                    <Loader2 size={16} className="text-slate-600 animate-spin" />
                                ) : (
                                    <Upload size={16} className="text-slate-600" />
                                )}
                            </button>
                        </div>
                        {formData.logoUrl && (
                            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <img
                                    src={
                                        formData.logoUrl.startsWith('http')
                                            ? formData.logoUrl
                                            : `${ASSET_BASE}${formData.logoUrl}`
                                    }
                                    alt="Logo Preview"
                                    className="h-12 object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-logo.png';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Favicon URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.faviconUrl}
                                onChange={(e) => setFormData({...formData, faviconUrl: e.target.value})}
                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="https://..."
                            />
                            <input
                                ref={faviconInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleFileUpload(file, 'favicon');
                                        // Reset input so same file can be selected again
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    faviconInputRef.current?.click();
                                }}
                                disabled={uploading === 'favicon'}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                                title="Favicon yükle"
                            >
                                {uploading === 'favicon' ? (
                                    <Loader2 size={16} className="text-slate-600 animate-spin" />
                                ) : (
                                    <Upload size={16} className="text-slate-600" />
                                )}
                            </button>
                        </div>
                        {formData.faviconUrl && (
                            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <img
                                    src={
                                        formData.faviconUrl.startsWith('http')
                                            ? formData.faviconUrl
                                            : `${ASSET_BASE}${formData.faviconUrl}`
                                    }
                                    alt="Favicon Preview"
                                    className="h-8 object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-favicon.png';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3">
                    İletişim Bilgileri
                </h3>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2 flex items-center gap-2">
                            <Mail size={12} />
                            Email Adresi
                        </label>
                        <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="info@sepya.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2 flex items-center gap-2">
                            <Phone size={12} />
                            Telefon
                        </label>
                        <input
                            type="tel"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="+90 555 123 4567"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2 flex items-center gap-2">
                        <MapPin size={12} />
                        Adres
                    </label>
                    <textarea
                        value={formData.contactAddress}
                        onChange={(e) => setFormData({...formData, contactAddress: e.target.value})}
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                        placeholder="Kadıköy, İstanbul, Türkiye"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2 flex items-center gap-2">
                        <Clock size={12} />
                        Çalışma Saatleri
                    </label>
                    <input
                        type="text"
                        value={formData.businessHours}
                        onChange={(e) => setFormData({...formData, businessHours: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Pazartesi - Cuma: 09:00 - 18:00"
                    />
                </div>
            </div>
        </div>
    );
}