"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    const [config, setConfig] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        setIsMounted(true);

        fetch(`${API_BASE}/hero`)
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(err => console.error("Hero yükleme hatası:", err));
    }, [API_BASE]);

    if (!config) {
        return <section className="w-full h-[35vh] md:h-screen min-h-[300px] md:min-h-[700px] bg-black" />;
    }

    const bgImage = config.imageUrl.startsWith("http")
        ? config.imageUrl
        : `${process.env.NEXT_PUBLIC_ASSET_URL}${config.imageUrl}`;

    return (
        <section
            className="relative w-full h-[35vh] md:h-screen min-h-[300px] md:min-h-[700px] overflow-hidden bg-black"
            suppressHydrationWarning
        >
            {/* Arka Plan Görseli */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-95 transition-all duration-1000"
                style={{ backgroundImage: `url('${bgImage}')` }}
            />

            {/* Alt Kısımdaki Butonun Okunabilirliği İçin Yumuşak Karartma (Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

            {/* Butonun Konumlandırıldığı Ana Kapsayıcı */}
            <div className="absolute bottom-8 md:bottom-16 left-0 right-0 flex justify-center items-center z-10">
                {isMounted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Yeni Şekilli ve Modern Buton Tasarımı */}
                        <Link
                            href={config.buttonLink || "/shop"}
                            className="group relative inline-flex items-center justify-center px-10 py-4 md:px-16 md:py-5 overflow-hidden font-black uppercase tracking-[0.25em] text-[10px] md:text-xs text-white border-2 border-white rounded-full transition-all duration-500 hover:text-black shadow-2xl backdrop-blur-sm"
                        >
                            {/* Buton Hover Efekti İçin Arka Plan Animasyon Katmanı */}
                            <span className="absolute inset-0 w-full h-full bg-white transition-all duration-500 ease-out transform scale-x-0 group-hover:scale-x-100 origin-center z-0" />

                            {/* Buton Metni (Z-index ile en üste alındı) */}
                            <span className="relative z-10 flex items-center gap-2">
                                {config.buttonText}
                                {/* Şık bir ok işareti (Opsiyonel, modern durması için eklendi) */}
                                <svg
                                    className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}