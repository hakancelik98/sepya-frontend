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
            {/* Mobil: 2 kolonlu grid
                Desktop (md): 3 kolonlu standart grid (isteğe bağlı değiştirebilirsin)
            */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
                {brands.map((brand, i) => {
                    // MODÜLO MANTIĞI:
                    // i=2 (3. eleman), i=5 (6. eleman) vb. durumlarında tam genişlik yap
                    const isFullWidthMobile = (i + 1) % 3 === 0;

                    return (
                        <Link
                            key={brand.id}
                            href={`/shop?brand=${brand.slug}`}
                            className={`block ${isFullWidthMobile ? "col-span-2 md:col-span-1" : "col-span-1"}`}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className={`group relative overflow-hidden bg-neutral-50 shadow-sm ${
                                    /* isFullWidthMobile: Tam sayfa olanların yüksekliği. 
                                       aspect-[21/9] görseli daha basık/yatay yapar.
                                       Eğer hala büyük gelirse aspect-[3/1] yapabilirsin.
                                    */
                                    isFullWidthMobile
                                        ? "aspect-[21/9] md:aspect-[16/10]"
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

                                {/* İÇERİK - Tam sayfa olanlarda yazıların çok büyük durmaması için flex-row da yapılabilir */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center transition-all duration-700 group-hover:opacity-0 group-hover:translate-y-4">
                                    {brand.logoUrl && (
                                        <div className={`relative mb-4 ${isFullWidthMobile ? "w-20 h-8 md:w-28 md:h-16" : "w-16 h-10 md:w-28 md:h-16"}`}>
                                            <Image
                                                src={fixUrl(brand.logoUrl)}
                                                alt={brand.name}
                                                fill
                                                className="object-contain filter brightness-0"
                                                unoptimized
                                            />
                                        </div>
                                    )}

                                    <h2 className="text-[11px] md:text-[15px] font-bold uppercase tracking-[0.5em] text-black leading-none">
                                        {brand.name}
                                    </h2>

                                    {/* Tam sayfa olanda çizgi arasını biraz daralttık */}
                                    <div className={`${isFullWidthMobile ? "mt-3" : "mt-5"} h-[1.5px] w-14 bg-[#C5A059]`} />

                                    <span className="mt-3 text-[8px] font-light uppercase tracking-[0.3em] text-black/50">
                Koleksiyonu İncele
            </span>
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