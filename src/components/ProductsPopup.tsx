"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const brandsMenuVariants: Variants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: -30, opacity: 0, transition: { duration: 0.2 } },
};

export default function BrandsPopup({ onClose }: { onClose: () => void }) {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        // Backend'deki BrandController'ın @GetMapping("/active") endpoint'ini çağırıyoruz
        fetch(`${BASE_URL}/brands/active`)
            .then((res) => res.json())
            .then((data) => {
                setBrands(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const fixUrl = (path: string) => {
        if (!path) return "/placeholder.jpg";
        if (path.startsWith("http")) return path;

        return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    };

    return (
        <motion.div
            variants={brandsMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full w-[85vw] md:w-96 bg-white border-r border-gray-100 p-8 shadow-2xl overflow-y-auto"
        >
            <div className="mb-10">
                <h3 className="text-2xl font-black italic tracking-tighter uppercase">Koleksiyonlar</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Öne Çıkan Markalar</p>
            </div>

            <div className="flex flex-col gap-3">
                {loading ? (
                    // Skeleton Loading
                    [1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl" />
                    ))
                ) : (
                    brands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/brand/${brand.slug}`}
                            onClick={onClose}
                            className="group relative h-20 overflow-hidden rounded-2xl border border-gray-50 hover:border-stone-900 transition-all duration-500"
                        >
                            {/* Marka Görseli (Background) */}
                            <Image
                                src={fixUrl(brand.imageUrl)}
                                alt={brand.name}
                                fill
                                className="object-cover opacity-40 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                                unoptimized
                            />

                            {/* Overlay ve Marka Adı */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent group-hover:from-black/80 transition-all" />

                            <div className="absolute inset-0 flex items-center px-6">
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-[9px] tracking-[0.3em] uppercase mb-0.5 opacity-60">
                                        BRAND
                                    </span>
                                    <span className="text-white font-black text-lg tracking-tighter uppercase italic">
                                        {brand.name}
                                    </span>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                    <span className="text-white text-xl">→</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            <div className="mt-12 p-6 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <p className="text-[9px] text-stone-400 uppercase leading-relaxed tracking-widest text-center">
                    Tüm koleksiyonlarımız küratörlerimiz tarafından <br/> özenle seçilmiştir.
                </p>
            </div>
        </motion.div>
    );
}