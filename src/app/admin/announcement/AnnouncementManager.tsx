"use client";
import { useState, useEffect } from "react";
import { Save, RefreshCw, Megaphone, Info, AlertCircle } from "lucide-react";

export default function AnnouncementManager() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements`)
            .then(res => res.json())
            .then(data => {
                const clean = (data.content ?? "")
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                    .join(", ");

                setText(clean);
            });
    }, []);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

    const handleSave = async () => {
        if (!text.trim()) return alert("Duyuru boş olamaz");

        setLoading(true);

        try {
            await fetch(`${API_BASE}/announcements`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: text })
            });

            alert("Duyuru başarıyla güncellendi!");
        } catch {
            alert("Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
            {/* Üst Başlık Alanı */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                        <Megaphone size={20} strokeWidth={2.5} />
                        Duyuru Barı Yönetimi
                    </h1>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Sitenin en üstünde kayan mesajları düzenleyin
                    </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>
                    Canlı Yayınlanıyor
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Taraf: Düzenleme Alanı */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Duyuru Metni</span>
                            <span className="text-[10px] font-bold text-slate-400">{text.length} Karakter</span>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Örn: 500 TL üzeri kargo bedava! , Yeni sezon ürünleri yayında..."
                            className="w-full h-40 p-4 text-sm font-medium focus:outline-none focus:ring-0 resize-none placeholder:text-slate-300"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        Değişiklikleri Yayınla
                    </button>
                </div>

                {/* Sağ Taraf: Bilgi & İpuçları */}
                <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3 text-black">
                            <Info size={16} strokeWidth={2.5} />
                            <h3 className="text-xs font-black uppercase tracking-tighter">Kullanım Kılavuzu</h3>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-2">
                                <div className="w-1 h-1 bg-black rounded-full mt-1.5 shrink-0"></div>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    Mesajları ayırmak için <strong>virgül (,)</strong> kullanın. Her virgül yeni bir kayan yazı oluşturur.
                                </p>
                            </li>
                            <li className="flex gap-2">
                                <div className="w-1 h-1 bg-black rounded-full mt-1.5 shrink-0"></div>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    Maksimum okunabilirlik için her mesajın <strong>50 karakterden</strong> kısa olmasını öneririz.
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2 text-amber-700">
                            <AlertCircle size={16} strokeWidth={2.5} />
                            <h3 className="text-xs font-black uppercase tracking-tighter">Önemli Not</h3>
                        </div>
                        <p className="text-[11px] text-amber-700/80 font-medium leading-relaxed">
                            Yayınla butonuna bastığınız anda değişiklikler tüm müşterileriniz için anında aktif olacaktır.
                        </p>
                    </div>
                </div>
            </div>

            {/* Alt Bilgi */}
            <div className="mt-12 pt-6 border-t border-slate-100 flex justify-center">
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                    Sepya Design System • v2.0
                </p>
            </div>
        </div>
    );
}