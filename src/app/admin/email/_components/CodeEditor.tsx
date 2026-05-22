"use client";
import { useState } from "react";
import { FileCode, Type, Settings } from "lucide-react";

interface CodeEditorProps {
    formData: any;
    setFormData: (data: any) => void;
    onInsertVariable: (variable: string) => void;
}

export default function CodeEditor({ formData, setFormData, onInsertVariable }: CodeEditorProps) {
    const [activeTab, setActiveTab] = useState<'html' | 'text' | 'settings'>('html');

    return (
        <div className="flex flex-col h-full">
            {/* Tabs - More spacious */}
            <div className="border-b border-slate-200 bg-slate-50 px-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('html')}
                        className={`px-5 py-3.5 text-sm font-semibold transition-all flex items-center gap-2 ${
                            activeTab === 'html'
                                ? 'bg-white text-slate-900 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                        }`}
                    >
                        <FileCode size={16} />
                        HTML İçerik
                    </button>
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`px-5 py-3.5 text-sm font-semibold transition-all flex items-center gap-2 ${
                            activeTab === 'text'
                                ? 'bg-white text-slate-900 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                        }`}
                    >
                        <Type size={16} />
                        Düz Metin
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-5 py-3.5 text-sm font-semibold transition-all flex items-center gap-2 ${
                            activeTab === 'settings'
                                ? 'bg-white text-slate-900 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                        }`}
                    >
                        <Settings size={16} />
                        Ayarlar
                    </button>
                </div>
            </div>

            {/* Content - Much more spacious */}
            <div className="flex-1 overflow-auto p-8 space-y-6">
                {activeTab === 'html' && (
                    <div className="space-y-6">
                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Email Konusu (Subject)
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                placeholder="Siparişiniz Alındı - Sipariş #12345"
                            />
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                                💡 Değişken kullanabilirsiniz: <code className="px-2 py-0.5 bg-slate-100 rounded font-mono">{'{{customerName}}'}</code>
                            </p>
                        </div>

                        {/* HTML Content */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-semibold text-slate-700">
                                    HTML İçerik
                                </label>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            htmlContent: formData.htmlContent + '\n<!-- Yeni yorum -->\n'
                                        });
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                                >
                                    + Yorum Ekle
                                </button>
                            </div>
                            <textarea
                                name="htmlContent"
                                value={formData.htmlContent}
                                onChange={(e) => setFormData({...formData, htmlContent: e.target.value})}
                                className="w-full h-[600px] px-5 py-4 border border-slate-300 rounded-xl text-sm font-mono leading-relaxed focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none bg-slate-900 text-green-400"
                                placeholder="<html>
  <body>
    <h1>Merhaba {{customerName}}</h1>
  </body>
</html>"
                                spellCheck={false}
                            />
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                                💡 HTML ve inline CSS kullanabilirsiniz. Değişkenler: <code className="px-2 py-0.5 bg-slate-100 rounded font-mono">{'{{variable}}'}</code>
                            </p>
                        </div>

                        {/* Quick HTML Templates */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                            <p className="text-sm font-semibold text-blue-900 mb-3">⚡ Hızlı Şablonlar</p>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            htmlContent: formData.htmlContent + '\n<p style="color: #333; margin: 10px 0;">İçerik buraya</p>\n'
                                        });
                                    }}
                                    className="px-4 py-2.5 bg-white hover:bg-blue-50 rounded-lg text-sm font-medium text-blue-900 transition-all shadow-sm border border-blue-100"
                                >
                                    + Paragraf
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            htmlContent: formData.htmlContent + '\n<a href="#" style="color: #0066cc; text-decoration: none;">Link metni</a>\n'
                                        });
                                    }}
                                    className="px-4 py-2.5 bg-white hover:bg-blue-50 rounded-lg text-sm font-medium text-blue-900 transition-all shadow-sm border border-blue-100"
                                >
                                    + Link
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            htmlContent: formData.htmlContent + '\n<div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin: 16px 0;">İçerik</div>\n'
                                        });
                                    }}
                                    className="px-4 py-2.5 bg-white hover:bg-blue-50 rounded-lg text-sm font-medium text-blue-900 transition-all shadow-sm border border-blue-100"
                                >
                                    + Kutu
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            htmlContent: formData.htmlContent + '\n<button style="background: #0066cc; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Buton</button>\n'
                                        });
                                    }}
                                    className="px-4 py-2.5 bg-white hover:bg-blue-50 rounded-lg text-sm font-medium text-blue-900 transition-all shadow-sm border border-blue-100"
                                >
                                    + Buton
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'text' && (
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Düz Metin İçerik (Fallback)
                        </label>
                        <textarea
                            value={formData.textContent}
                            onChange={(e) => setFormData({...formData, textContent: e.target.value})}
                            className="w-full h-[650px] px-5 py-4 border border-slate-300 rounded-xl text-sm font-mono leading-relaxed focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                            placeholder="HTML desteklemeyen email istemcileri için düz metin versiyonu...

Merhaba {{customerName}},

Siparişiniz alındı!
Sipariş No: {{orderNumber}}
Toplam: {{totalAmount}} TL"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            💡 Eski email istemcileri için HTML olmadan sadece metin versiyonu
                        </p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6 max-w-3xl">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Template Adı
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                placeholder="Örn: Sipariş Onay Maili"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Template Kodu (Unique)
                            </label>
                            <input
                                type="text"
                                value={formData.templateCode}
                                onChange={(e) => setFormData({...formData, templateCode: e.target.value})}
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-mono bg-slate-50 text-slate-500 cursor-not-allowed"
                                disabled
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                🔒 Template kodu değiştirilemez
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Açıklama
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={4}
                                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-sm leading-relaxed focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                                placeholder="Template hakkında açıklama yazın..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Kategori
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            >
                                <option value="CUSTOMER">👤 Müşteri</option>
                                <option value="ADMIN">⚙️ Admin</option>
                                <option value="NOTIFICATION">🔔 Bildirim</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Kullanılabilir Değişkenler
                            </label>
                            <input
                                type="text"
                                value={formData.availableVariables}
                                onChange={(e) => setFormData({...formData, availableVariables: e.target.value})}
                                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-sm font-mono focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                placeholder="customerName, orderNumber, totalAmount"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                💡 Virgülle ayırarak yazın
                            </p>
                        </div>

                        <label className="flex items-start gap-4 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-all">
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                                className="w-5 h-5 rounded-lg border-emerald-300 text-emerald-600 mt-0.5"
                            />
                            <div>
                                <p className="text-sm font-semibold text-emerald-900">Template Aktif</p>
                                <p className="text-xs text-emerald-700 mt-1">Pasif template'ler mail gönderiminde kullanılmaz</p>
                            </div>
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}