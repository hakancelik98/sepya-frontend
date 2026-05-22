"use client";
import { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Link as LinkIcon, Type } from "lucide-react";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

export default function HeroManagerModule() {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [heroData, setHeroData] = useState({
        upperTitle: "Sepya Official",
        mainTitle: "STİLİNİ",
        italicTitle: "YANSIT",
        buttonText: "Koleksiyonu İncele",
        buttonLink: "/shop",
        imageUrl: "/hero.jpg"
    });

    // Mevcut veriyi çek
    useEffect(() => {
        fetch(`${API_BASE}/hero`)
            .then(res => res.json())
            .then(data => {
                setHeroData(data);

                if (data.imageUrl) {
                    const fullPath = data.imageUrl.startsWith("/")
                        ? `${ASSET_BASE}${data.imageUrl}`
                        : data.imageUrl;

                    setPreviewImage(fullPath);
                }
            });
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleSave = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("upperTitle", heroData.upperTitle);
        formData.append("mainTitle", heroData.mainTitle);
        formData.append("italicTitle", heroData.italicTitle);
        formData.append("buttonText", heroData.buttonText);
        formData.append("buttonLink", heroData.buttonLink);
        if (file) formData.append("image", file);

        try {
            const res = await fetch(`${API_BASE}/hero`, {
                method: "POST",
                body: formData
            });

            if (res.ok) alert("Hero başarıyla güncellendi!");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 lg:p-12 bg-white min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Mağaza Ayarları</h2>
                    <h1 className="text-4xl font-light uppercase tracking-tighter text-black">Hero (Ana Görsel) Yönetimi</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* SOL TARAF: FORM */}
                    <div className="space-y-8">
                        <div className="space-y-6 bg-gray-50 p-8 rounded-sm border border-gray-100">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <Type size={14} /> Başlık Ayarları
                                </label>
                                <input
                                    type="text"
                                    placeholder="Üst Başlık (Örn: Sepya Official)"
                                    className="w-full bg-white border border-gray-200 p-4 text-xs font-bold outline-none focus:border-black transition-all"
                                    value={heroData.upperTitle}
                                    onChange={(e) => setHeroData({...heroData, upperTitle: e.target.value})}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Ana Başlık (Örn: STİLİNİ)"
                                        className="w-full bg-white border border-gray-200 p-4 text-xs font-bold outline-none focus:border-black"
                                        value={heroData.mainTitle}
                                        onChange={(e) => setHeroData({...heroData, mainTitle: e.target.value})}
                                    />
                                    <input
                                        type="text"
                                        placeholder="İtalik Vurgu (Örn: YANSIT)"
                                        className="w-full bg-white border border-gray-200 p-4 text-xs font-bold outline-none focus:border-black italic"
                                        value={heroData.italicTitle}
                                        onChange={(e) => setHeroData({...heroData, italicTitle: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <LinkIcon size={14} /> Buton Yapılandırması
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Buton Metni"
                                        className="w-full bg-white border border-gray-200 p-4 text-xs font-bold outline-none focus:border-black"
                                        value={heroData.buttonText}
                                        onChange={(e) => setHeroData({...heroData, buttonText: e.target.value})}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Link (Örn: /shop)"
                                        className="w-full bg-white border border-gray-200 p-4 text-xs font-bold outline-none focus:border-black"
                                        value={heroData.buttonLink}
                                        onChange={(e) => setHeroData({...heroData, buttonLink: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <ImageIcon size={14} /> Arka Plan Görseli
                                </label>
                                <input
                                    type="file"
                                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-black text-white py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-4 shadow-xl disabled:bg-gray-400"
                        >
                            <Save size={18} /> {loading ? "KAYDEDİLİYOR..." : "HERO AYARLARINI GÜNCELLE"}
                        </button>
                    </div>

                    {/* SAĞ TARAF: CANLI ÖN İZLEME */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-center text-gray-400">Canlı Ön İzleme</h3>
                        <div className="relative aspect-square lg:aspect-video w-full bg-black overflow-hidden shadow-2xl group border-[12px] border-white ring-1 ring-gray-100">
                            {previewImage && (
                                <Image
                                    src={previewImage}
                                    alt="Hero Preview"
                                    fill
                                    className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
                                />
                            )}
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                                <span className="text-white/80 text-[8px] font-bold tracking-[0.4em] uppercase mb-3">
                                    {heroData.upperTitle}
                                </span>
                                <h1 className="text-white text-2xl md:text-4xl font-black uppercase leading-none mb-4 tracking-tighter">
                                    {heroData.mainTitle} <br />
                                    <span className="font-light italic lowercase">{heroData.italicTitle}</span>
                                </h1>
                                <button className="px-6 py-2 bg-white text-black font-black uppercase tracking-widest text-[8px]">
                                    {heroData.buttonText}
                                </button>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-400 text-center italic">* Ön izleme yaklaşık değerleri gösterir, web sitesinde tam ekran görünür.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}