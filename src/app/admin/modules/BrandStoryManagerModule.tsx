"use client";
import { useState, useEffect, useCallback } from "react";
import { Save, Upload, Link2, AlignLeft, ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";

// 1. TİP TANIMLAMALARI (Interfaces)
interface InstagramPost {
    id?: number;
    slotIndex: number;
    imageUrl: string;
    postUrl: string;
    previewUrl: string | null;
    newFile?: File; // Yeni yüklenen dosya için
}


interface BrandStorySettings {
    sectionTitle: string;
    sectionSubtitle: string;
    description: string;
    instagramUsername: string;
    instagramFollowUrl: string;
    followerCountText: string;
}

export default function BrandStoryManagerModule() {
    // Başlangıç slotlarını tip güvencesine alıyoruz
    const [posts, setPosts] = useState<InstagramPost[]>(
        Array.from({ length: 6 }, (_, i) => ({
            slotIndex: i + 1,
            imageUrl: "",
            postUrl: "",
            previewUrl: null
        }))
    );

    const [settings, setSettings] = useState<BrandStorySettings>({
        sectionTitle: "", sectionSubtitle: "", description: "",
        instagramUsername: "", instagramFollowUrl: "", followerCountText: ""
    });

    const [loading, setLoading] = useState(false);
    const [savedSlot, setSavedSlot] = useState<number | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
    const API_ASSET = process.env.NEXT_PUBLIC_ASSET_URL ?? "";

    const fetchData = useCallback(async () => {
        try {
            const [postsRes, settingsRes] = await Promise.all([
                fetch(`${API_BASE}/instagram-posts`),
                fetch(`${API_BASE}/brand-story-settings`)
            ]);

            if (postsRes.ok) {
                const postsData: InstagramPost[] = await postsRes.json();
                setPosts(currentPosts =>
                    currentPosts.map(emptySlot => {
                        const found = postsData.find((p) => p.slotIndex === emptySlot.slotIndex);
                        return found ? { ...found, previewUrl: null } : emptySlot;
                    })
                );
            }

            if (settingsRes.ok) {
                const settingsData: BrandStorySettings = await settingsRes.json();
                if (settingsData) setSettings(settingsData);
            }
        } catch (error) {
            console.error("Veri yüklenirken hata oluştu:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePostSave = async (index: number) => {
        setLoading(true);
        const item = posts[index];
        const formData = new FormData();
        formData.append("slotIndex", item.slotIndex.toString());
        formData.append("postUrl", item.postUrl || "");

        if (item.newFile) {
            formData.append("image", item.newFile);
        }

        try {
            const res = await fetch(`${API_BASE}/instagram-posts`, {
                method: "POST",
                body: formData
            });
            if (res.ok) {
                setSavedSlot(item.slotIndex);
                setTimeout(() => setSavedSlot(null), 2000);
                fetchData();
            }
        } catch (error) {
            alert("Kaydetme sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-white min-h-screen">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="border-b pb-6">
                    <h1 className="text-3xl font-light uppercase italic">Instagram <span className="text-pink-500 font-serif">Grid</span> Yönetimi</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-2">6 Görsel Slotunu ve Sayfa Metinlerini Düzenleyin</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-sm flex flex-col gap-4 group hover:shadow-md transition-all">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded-full">SLOT 0{post.slotIndex}</span>
                                <ImageIcon size={14} className="text-gray-300" />
                            </div>

                            <div className="relative aspect-square w-full bg-white border border-gray-200 overflow-hidden group/img">
                                <Image
                                    src={
                                        post.previewUrl ||
                                        (post.imageUrl
                                            ? post.imageUrl.startsWith("http")
                                                ? post.imageUrl
                                                : `${API_ASSET}${post.imageUrl}`
                                            : "/placeholder-brand.jpg")
                                    }
                                    alt="Instagram Slot"
                                    fill
                                    className="object-cover"
                                />
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                                    <Upload className="text-white mb-2" size={20} />
                                    <span className="text-[10px] text-white font-bold uppercase">Görsel Seç</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                const newPosts = [...posts];
                                                newPosts[idx].newFile = e.target.files[0];
                                                newPosts[idx].previewUrl = URL.createObjectURL(e.target.files[0]);
                                                setPosts(newPosts);
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    <Link2 className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Instagram Post URL"
                                        value={post.postUrl || ""}
                                        onChange={(e) => {
                                            const newPosts = [...posts];
                                            newPosts[idx].postUrl = e.target.value;
                                            setPosts(newPosts);
                                        }}
                                        className="w-full pl-8 pr-3 py-2 text-[10px] font-bold border border-gray-200 outline-none focus:border-pink-500"
                                    />
                                </div>
                                <button
                                    onClick={() => handlePostSave(idx)}
                                    disabled={loading}
                                    className={`w-full py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                                        ${savedSlot === post.slotIndex ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-pink-600'}
                                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {savedSlot === post.slotIndex ? <CheckCircle2 size={14} /> : <Save size={14} />}
                                    {savedSlot === post.slotIndex ? "KAYDEDİLDİ" : "GÜNCELLE"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-900 text-white p-10 rounded-sm space-y-8">
                    <h2 className="text-xl font-light italic border-b border-gray-700 pb-4 flex items-center gap-3">
                        <AlignLeft className="text-pink-500" /> Bölüm İçerik Ayarları
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <InputField label="Instagram Kullanıcı Adı" value={settings.instagramUsername} onChange={(v) => setSettings({...settings, instagramUsername: v})} />
                            <InputField label="Ana Başlık" value={settings.sectionTitle} onChange={(v) => setSettings({...settings, sectionTitle: v})} />
                            <InputField label="İtalik Başlık" value={settings.sectionSubtitle} onChange={(v) => setSettings({...settings, sectionSubtitle: v})} />
                        </div>
                        <div className="space-y-4">
                            <InputField label="Takip Et Buton Linki" value={settings.instagramFollowUrl} onChange={(v) => setSettings({...settings, instagramFollowUrl: v})} />
                            <InputField label="Takipçi Yazısı" value={settings.followerCountText} onChange={(v) => setSettings({...settings, followerCountText: v})} />
                            <div>
                                <label className="text-[8px] font-black uppercase text-gray-500 mb-1 block">Açıklama</label>
                                <textarea
                                    value={settings.description || ""}
                                    onChange={(e) => setSettings({...settings, description: e.target.value})}
                                    className="w-full bg-gray-800 border-none p-3 text-xs outline-none focus:ring-1 focus:ring-pink-500 h-20"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={async () => {
                            await fetch(`${API_BASE}/brand-story-settings`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(settings)
                            });
                            alert("Metinler güncellendi!");
                        }}
                        className="w-full py-4 bg-pink-600 text-white font-black uppercase text-[11px] tracking-[0.3em] hover:bg-pink-700 transition-all"
                    >
                        TÜM METİNLERİ YAYINLA
                    </button>
                </div>
            </div>
        </div>
    );
}

// 2. YARDIMCI BİLEŞEN TİPLERİ
interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

function InputField({ label, value, onChange }: InputFieldProps) {
    return (
        <div>
            <label className="text-[8px] font-black uppercase text-gray-500 mb-1 block">{label}</label>
            <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-800 border-none p-3 text-xs outline-none focus:ring-1 focus:ring-pink-500"
            />
        </div>
    );
}