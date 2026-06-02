"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "700"],
});

interface Brand {
    id: number;
    name: string;
    logoUrl: string;
    imageUrl: string;
    slug: string;
}

export default function Brands() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL?.replace(/\/$/, "");

    useEffect(() => {
        fetch(`${API_URL}/brands/active`)
            .then(res => res.json())
            .then(data => {
                setBrands(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Marka yükleme hatası:", err);
                setLoading(false);
            });
    }, [API_URL]);

    const fixUrl = (path: string) => {
        if (!path) return "/placeholder.jpg";
        if (path.startsWith("http")) return path;
        const base = ASSET_URL || API_URL;
        return `${base}${path.startsWith("/") ? path : `/${path}`}`;
    };

    if (loading) return null;

    return (
        <section className={`w-full bg-white p-2 ${montserrat.className}`}>
            {/* Masaüstünde (md) flex yapısı kullanarak kartların boşluğu doldurmasını (grow) sağladık */}
            <div className="grid grid-cols-2 gap-2 w-full md:flex md:flex-wrap">
                {brands.map((brand, i) => {
                    // MOBİL MODÜLO MANTIĞI:
                    const isFullWidthMobile = (i + 1) % 3 === 0;

                    return (
                        <Link
                            key={brand.id}
                            href={`/shop?brand=${brand.slug}`}
                            className={`block transition-all duration-300
                            ${isFullWidthMobile ? "col-span-2" : "col-span-1"} 
                            md:w-[calc(33.333%-6px)] md:flex-grow md:shrink-0`}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className={`group relative overflow-hidden bg-neutral-50 shadow-sm w-full ${
                                    isFullWidthMobile
                                        ? "aspect-[21/9] md:aspect-[16/10]" // İstersen son satır çok yayvan gelirse md:aspect-[21/9] veya [3/1] yapabilirsin
                                        : "aspect-[16/10]"
                                }`}
                            >
                                {/* ARKA PLAN GÖRSELİ */}
                                <div className="absolute inset-0 z-0">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                                        style={{ backgroundImage: `url(${fixUrl(brand.imageUrl)})` }}
                                    />
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-transparent transition-all duration-1000 ease-in-out" />
                                </div>

                                {/* İÇERİK - Sadece Logo */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-700">
                                    {brand.logoUrl && (
                                        <div className="relative w-20 h-10 md:w-32 md:h-16">
                                            <Image
                                                src={fixUrl(brand.logoUrl)}
                                                alt={brand.name}
                                                fill
                                                className="object-contain filter brightness-0"
                                                unoptimized
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="absolute inset-0 border border-black/[0.03] pointer-events-none" />
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}