"use client";
import { useState, useEffect } from "react";
import {
    Save, RefreshCcw, X, Plus, Search,
    Trash2, ArrowRight, Zap, RotateCcw, LayoutGrid, Paintbrush,
    TrendingUp, ArrowDownWideNarrow, ArrowUpWideNarrow, Calendar,
    Type, AlignLeft
} from "lucide-react";
import Image from "next/image";

export default function SliderPage() {
    const [slots, setSlots] = useState<any[]>(Array(8).fill(null));
    const [allProducts, setAllProducts] = useState<any[]>([]);

    // 1. ANA BAŞLIK STATE'LERİ
    const [sliderTitle, setSliderTitle] = useState("");
    const [titleColor, setTitleColor] = useState("#000000");
    const [titleSize, setTitleSize] = useState("24");

    // 2. ALT BAŞLIK STATE'LERİ
    const [sliderSubTitle, setSliderSubTitle] = useState("");
    const [subTitleColor, setSubTitleColor] = useState("#64748b");
    const [subTitleSize, setSubTitleSize] = useState("14");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    const loadData = async () => {
        setLoading(true);
        try {
            const [sRes, pRes] = await Promise.all([
                fetch(`${API_BASE}/slider`),
                fetch(`${API_BASE}/products`)
            ]);

            // ÖNEMLİ: Backend'den gelen Map yapısını (items ve settings) doğru karşıla
            const sliderData = sRes.ok ? await sRes.json() : {};
            const productsData = pRes.ok ? await pRes.json() : [];

            setAllProducts(Array.isArray(productsData) ? productsData : []);

            // Tasarım ayarlarını yükle (sliderData.settings içindeyse ona göre ayarla)
            // Eğer getSliderData() metodun Map içinde "settings" ve "items" dönüyorsa:
            const settings = sliderData.settings || sliderData;

            setSliderTitle(settings.title || "");
            setTitleColor(settings.titleColor || "#000000");
            setTitleSize(settings.titleSize || "24");
            setSliderSubTitle(settings.subTitle || "");
            setSubTitleColor(settings.subTitleColor || "#64748b");
            setSubTitleSize(settings.subTitleSize || "14");

            const newSlots = Array(8).fill(null);

            // EŞLEŞTİRME HATASI BURADA OLABİLİR:
            // Backend'de SliderItem içindeki alan 'position' mı yoksa 'slotIndex' mi?
            // SliderItem.java dosyana göre bu alan 'position'.
            if (sliderData.items && Array.isArray(sliderData.items)) {
                sliderData.items.forEach((item: any) => {
                    // Eğer backend position'ı 1-8 arası veriyorsa (index + 1)
                    // index = position - 1;
                    // Eğer backend 0-7 arası veriyorsa index = position;

                    const index = item.position;
                    if (index >= 0 && index < 8) {
                        newSlots[index] = item.product;
                    }
                });
            }
            setSlots(newSlots);
        } catch (error) {
            console.error("Yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const fastAssign = (type: 'newest' | 'cheapest' | 'expensive' | 'trending') => {
        let sorted = [...allProducts];
        if (type === 'newest') sorted.sort((a, b) => b.id - a.id);
        else if (type === 'cheapest') sorted.sort((a, b) => a.price - b.price);
        else if (type === 'expensive') sorted.sort((a, b) => b.price - a.price);
        else if (type === 'trending') sorted = sorted.reverse();

        const newSlots = Array(8).fill(null);
        sorted.slice(0, 8).forEach((p, i) => { newSlots[i] = p; });
        setSlots(newSlots);
    };

    const handleSave = async () => {
        setLoading(true);
        const payload = {
            title: sliderTitle,
            titleColor,
            titleSize,
            subTitle: sliderSubTitle,
            subTitleColor,
            subTitleSize,
            items: slots.map((product, index) => product ? { productId: product.id, slotIndex: index } : null).filter(Boolean)
        };
        try {
            const res = await fetch(`${API_BASE}/slider`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if(res.ok) alert("Slider ve tüm stil ayarları kaydedildi!");
        } catch { alert("Hata!"); } finally { setLoading(false); }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-500">
            {/* Header Bölümü */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2 text-black">
                        <LayoutGrid size={20} /> Slider Editörü
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setSlots(Array(8).fill(null))} className="px-4 py-2 text-[10px] font-bold uppercase border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">Sıfırla</button>
                    <button onClick={handleSave} disabled={loading} className="bg-black text-white px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10">
                        {loading ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />} Kaydet
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SOL PANEL: TASARIM ARAÇLARI (4 Kolon) */}
                <div className="lg:col-span-4 space-y-4">

                    {/* ANA BAŞLIK AYARLARI */}
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                            <Type size={16} className="text-black" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Ana Başlık Stili</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">Renk</label>
                                <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                                    <span className="text-[10px] font-mono font-bold uppercase">{titleColor}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">Punto: {titleSize}px</label>
                                <input type="range" min="16" max="64" value={titleSize} onChange={(e) => setTitleSize(e.target.value)} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none accent-black" />
                            </div>
                        </div>
                    </div>

                    {/* ALT BAŞLIK AYARLARI */}
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                            <AlignLeft size={16} className="text-slate-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Alt Başlık Stili</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">Renk</label>
                                <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <input type="color" value={subTitleColor} onChange={(e) => setSubTitleColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                                    <span className="text-[10px] font-mono font-bold uppercase">{subTitleColor}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">Punto: {subTitleSize}px</label>
                                <input type="range" min="10" max="32" value={subTitleSize} onChange={(e) => setSubTitleSize(e.target.value)} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none accent-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* HIZLI ATAMA */}
                    <div className="bg-slate-900 p-5 rounded-2xl space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                            <Zap size={14} className="text-amber-400 fill-amber-400" /> Akıllı Doldurma
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => fastAssign('newest')} className="py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[9px] font-bold text-white uppercase transition-all">En Yeniler</button>
                            <button onClick={() => fastAssign('cheapest')} className="py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[9px] font-bold text-white uppercase transition-all">En Ucuzlar</button>
                            <button onClick={() => fastAssign('expensive')} className="py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[9px] font-bold text-white uppercase transition-all">En Pahalılar</button>
                            <button onClick={() => fastAssign('trending')} className="py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[9px] font-bold text-white uppercase transition-all">Trendler</button>
                        </div>
                    </div>
                </div>

                {/* SAĞ PANEL: CANLI ÖNİZLEME (8 Kolon) */}
                <div className="lg:col-span-8">
                    <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-10 min-h-full">
                        {/* Canlı Editlenebilir Başlıklar */}
                        <div className="mb-12 space-y-2">
                            <input
                                type="text"
                                value={sliderTitle}
                                onChange={(e) => setSliderTitle(e.target.value)}
                                style={{ color: titleColor, fontSize: `${titleSize}px` }}
                                placeholder="ANA BAŞLIK YAZIN..."
                                className="w-full bg-transparent border-none p-0 font-black uppercase tracking-tighter italic focus:outline-none transition-all placeholder:opacity-10"
                            />
                            <input
                                type="text"
                                value={sliderSubTitle}
                                onChange={(e) => setSliderSubTitle(e.target.value)}
                                style={{ color: subTitleColor, fontSize: `${subTitleSize}px` }}
                                placeholder="Alt başlık veya açıklama metni..."
                                className="w-full bg-transparent border-none p-0 font-bold focus:outline-none transition-all placeholder:opacity-20"
                            />
                        </div>

                        {/* Ürün Slotları */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {slots.map((product, index) => (
                                <div key={index} className={`group relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all overflow-hidden shadow-sm ${product ? "border-transparent" : "border-slate-200 bg-white hover:border-black"}`}>
                                    {product ? (
                                        <>
                                            <Image
                                                src={
                                                    product.imageUrl
                                                        ? (product.imageUrl.startsWith("http")
                                                            ? product.imageUrl
                                                            : `${ASSET_BASE}${product.imageUrl}`)
                                                        : "/placeholder.jpg"
                                                } alt="" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                                                <button onClick={() => { setActiveSlotIndex(index); setIsModalOpen(true); }} className="bg-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg"><RefreshCcw size={14} /></button>
                                                <button onClick={() => { const s = [...slots]; s[index]=null; setSlots(s); }} className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform shadow-lg"><Trash2 size={14} /></button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                                <p className="text-white text-[9px] font-black uppercase truncate">{product.title}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <button onClick={() => { setActiveSlotIndex(index); setIsModalOpen(true); }} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-black transition-all">
                                            <Plus size={18} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Ekle</span>
                                        </button>
                                    )}
                                    <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-md text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-lg border border-white/10">{index + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal (Daha kompakt hale getirildi) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b flex items-center justify-between">
                            <h2 className="text-[10px] font-black uppercase tracking-widest italic">Ürün Seçimi</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-black"><X size={20} /></button>
                        </div>
                        <div className="p-4">
                            <input type="text" placeholder="Ürün ara..." className="w-full bg-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="h-80 overflow-y-auto p-4 pt-0 space-y-2 custom-scrollbar">
                            {allProducts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                                <div key={p.id} onClick={() => {
                                    const newSlots = [...slots];
                                    newSlots[activeSlotIndex!] = p;
                                    setSlots(newSlots);
                                    setIsModalOpen(false);
                                }} className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 cursor-pointer group">
                                    <div className="w-10 h-12 relative bg-slate-200 rounded-lg overflow-hidden shrink-0">
                                        <Image
                                        src={
                                            p.imageUrl
                                                ? (p.imageUrl.startsWith("http")
                                                    ? p.imageUrl
                                                    : `${ASSET_BASE}${p.imageUrl}`)
                                                : "/placeholder.jpg"
                                        } alt="" fill className="object-cover" /></div>
                                    <div className="flex-1"><p className="text-[11px] font-black uppercase truncate tracking-tight text-slate-700">{p.title}</p></div>
                                    <Plus size={14} className="text-slate-300 group-hover:text-black transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}