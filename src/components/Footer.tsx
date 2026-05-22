"use client";

import { useEffect, useState } from "react";
import { Instagram, MessageCircle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";

type Category = {
    id: number;
    name: string;
    slug: string;
};

export default function Footer() {
    const { settings } = useSettings();
    const [categories, setCategories] = useState<Category[]>([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/categories/main`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) =>
                console.error("Footer kategori hatası:", err)
            );
    }, [API_URL]);

    return (
        <footer className="bg-[#fcfcfc] border-t border-gray-200 pt-20 pb-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-12 lg:gap-16 mb-20">

                    {/* MARKA */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-black italic">
                            {settings?.siteName || "SEPYA"}
                        </h2>

                        <p className="text-[12px] text-gray-700 font-medium uppercase tracking-widest leading-relaxed">
                            {settings?.siteDescription ||
                                "Zarafeti ve kaliteyi modern tasarımlarla buluşturan Sepya, eşarp ve şal dünyasında yeni bir soluk sunuyor."}
                        </p>

                        {/* Instagram */}
                        <div className="mt-6">
                            <a
                                href="https://instagram.com/sepya"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300">
                                    <Instagram size={16} className="text-white" />
                                </div>

                                <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-gray-700 group-hover:text-black transition duration-300">
                                    Instagram'da Bizi Takip Edin
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* KOLEKSİYONLAR (DOĞRU LİNK) */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black border-b border-black/10 pb-2 w-fit">
                            Koleksiyonlar
                        </h4>

                        <ul className="space-y-4 text-[12px] font-semibold uppercase tracking-widest text-gray-600">
                            {categories.slice(0, 6).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/shop?category=${cat.slug}`}
                                    className="block hover:text-black transition"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </ul>
                    </div>

                    {/* YARDIM */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black border-b border-black/10 pb-2 w-fit">
                            Yardım
                        </h4>

                        <ul className="space-y-4 text-[12px] font-semibold uppercase tracking-widest text-gray-600">
                            <Link href="/legal/terms" className="block hover:text-black transition">
                                Kullanım Şartları
                            </Link>
                            <Link href="/legal/privacy" className="block hover:text-black transition">
                                Gizlilik Politikası
                            </Link>
                            <Link href="/legal/return" className="block hover:text-black transition">
                                İade Politikası
                            </Link>
                        </ul>
                    </div>

                    {/* WHATSAPP */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-black border-b border-black/10 pb-2 w-fit">
                            Destek
                        </h4>

                        <p className="text-[12px] font-medium text-gray-600 uppercase tracking-widest leading-relaxed">
                            Siparişleriniz ve ürünler hakkında hızlı destek alın.
                        </p>

                        {settings?.contactPhone && (
                            <a
                                href={`https://wa.me/${settings.contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent("Merhaba " + (settings?.siteName || "Sepya") + ", ürün hakkında bilgi almak istiyorum.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300"
                            >
                                <MessageCircle size={18} />
                                WhatsApp Destek
                            </a>
                        )}

                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                            {settings?.businessHours || "09:00 – 18:00 arası aktif"}
                        </p>
                    </div>
                </div>

                {/* ALT KISIM */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-gray-200 gap-6">
                    <p className="text-[10px] text-black font-bold uppercase tracking-[0.3em]">
                        © 2026 {settings?.siteName?.toUpperCase() || "SEPYA"}. TÜM HAKLARI SAKLIDIR.
                    </p>

                    <div className="flex gap-4 opacity-80">
                        <div className="w-10 h-6 bg-gray-300 rounded-sm flex items-center justify-center text-[8px] font-bold text-gray-600">
                            VISA
                        </div>
                        <div className="w-10 h-6 bg-gray-300 rounded-sm flex items-center justify-center text-[8px] font-bold text-gray-600">
                            MC
                        </div>
                        <div className="w-10 h-6 bg-gray-300 rounded-sm flex items-center justify-center text-[8px] font-bold text-gray-600">
                            TROY
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
