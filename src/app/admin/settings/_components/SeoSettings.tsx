"use client";
import { useState } from "react";
import { Save, Search, FileText, Link2, Loader2, Image as ImageIcon } from "lucide-react";
import { settingsService } from "../_services/settingsService";

interface SeoSettingsProps {
    settings: any;
    onUpdate: () => void;
}

export default function SeoSettings({ settings, onUpdate }: SeoSettingsProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        metaTitle: settings?.metaTitle || '',
        metaDescription: settings?.metaDescription || '',
        metaKeywords: settings?.metaKeywords || '',
        robotsTxt: settings?.robotsTxt || 'User-agent: *\nDisallow:',
        sitemapUrl: settings?.sitemapUrl || '',
        canonicalUrl: settings?.canonicalUrl || '',
        ogImage: settings?.ogImage || ''
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateSection('seo', formData);
            alert('✅ SEO ayarları başarıyla güncellendi!');
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
                    <h2 className="text-lg font-black text-slate-900 uppercase">SEO Ayarları</h2>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Arama motoru optimizasyonu</p>
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

            {/* Meta Tags */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <Search size={16} />
                    Meta Tags
                </h3>

                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                        Meta Title (Max 60 karakter)
                    </label>
                    <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                        maxLength={60}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Sepya - Premium E-Commerce Mağazası"
                    />
                    <p className="text-[9px] text-slate-400 mt-1 text-right">
                        {formData.metaTitle.length}/60 karakter
                    </p>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                        Meta Description (Max 160 karakter)
                    </label>
                    <textarea
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                        maxLength={160}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                        placeholder="Kaliteli ürünler, hızlı teslimat ve güvenli alışveriş deneyimi için Sepya'yı tercih edin."
                    />
                    <p className="text-[9px] text-slate-400 mt-1 text-right">
                        {formData.metaDescription.length}/160 karakter
                    </p>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                        Meta Keywords (virgülle ayırın)
                    </label>
                    <input
                        type="text"
                        value={formData.metaKeywords}
                        onChange={(e) => setFormData({...formData, metaKeywords: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="e-ticaret, online alışveriş, moda, giyim"
                    />
                    <p className="text-[9px] text-slate-400 mt-1">
                        Örnek: e-ticaret, online alışveriş, moda, giyim
                    </p>
                </div>
            </div>

            {/* Open Graph */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <ImageIcon size={16} />
                    Open Graph (Sosyal Medya Önizleme)
                </h3>

                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                        OG Image URL (1200x630 önerilen)
                    </label>
                    <input
                        type="text"
                        value={formData.ogImage}
                        onChange={(e) => setFormData({...formData, ogImage: e.target.value})}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="https://sepya.com/og-image.jpg"
                    />
                    {formData.ogImage && (
                        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <img src={formData.ogImage} alt="OG Preview" className="w-full h-32 object-cover rounded" />
                        </div>
                    )}
                </div>
            </div>

            {/* Sitemap & Robots */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <FileText size={16} />
                    Sitemap & Robots.txt
                </h3>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2 flex items-center gap-2">
                            <Link2 size={12} />
                            Sitemap URL
                        </label>
                        <input
                            type="text"
                            value={formData.sitemapUrl}
                            onChange={(e) => setFormData({...formData, sitemapUrl: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="https://sepya.com/sitemap.xml"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2 flex items-center gap-2">
                            <Link2 size={12} />
                            Canonical URL
                        </label>
                        <input
                            type="text"
                            value={formData.canonicalUrl}
                            onChange={(e) => setFormData({...formData, canonicalUrl: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="https://sepya.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                        Robots.txt İçeriği
                    </label>
                    <textarea
                        value={formData.robotsTxt}
                        onChange={(e) => setFormData({...formData, robotsTxt: e.target.value})}
                        rows={6}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none bg-slate-900 text-green-400"
                    />
                </div>
            </div>

            {/* SEO Önizleme */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h4 className="text-[10px] font-black text-slate-600 uppercase mb-4">Google Arama Önizleme</h4>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <p className="text-blue-600 text-lg font-normal mb-1">
                        {formData.metaTitle || 'Sayfa Başlığınız'}
                    </p>
                    <p className="text-green-700 text-xs mb-2">
                        {formData.canonicalUrl || 'https://example.com'}
                    </p>
                    <p className="text-slate-600 text-sm">
                        {formData.metaDescription || 'Meta description buraya gelecek...'}
                    </p>
                </div>
            </div>
        </div>
    );
}