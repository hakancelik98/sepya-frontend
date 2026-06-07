"use client";
// components/HeroClient.tsx
// Sadece animasyon ve buton interaction için client component
// Görsel URL server'dan geliyor → tarayıcı preload edebiliyor → LCP düşüyor

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface HeroClientProps {
    config: any;
    bgImage: string | null;
}

export default function HeroClient({ config, bgImage }: HeroClientProps) {
    return (
        <section className="relative w-full h-[35vh] md:h-screen min-h-[300px] md:min-h-[700px] overflow-hidden bg-black">

            {/* Görsel: URL server'dan geldiği için tarayıcı hemen preload edebilir */}
            {bgImage && (
                <Image
                    src={bgImage}
                    alt={config?.title || "Sepya Eşarp Koleksiyonu"}
                    fill
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                    className="object-cover object-center opacity-95"
                />
            )}

            {/* Skeleton: görsel yoksa siyah arka plan göster */}
            {!bgImage && (
                <div className="absolute inset-0 bg-zinc-900" />
            )}

            {/* Alt gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />

            {/* Buton */}
            <div className="absolute bottom-8 md:bottom-16 left-0 right-0 flex justify-center items-center z-20">
                {config && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Link
                            href={config.buttonLink || "/shop"}
                            className="group relative inline-flex items-center justify-center px-10 py-4 md:px-16 md:py-5 overflow-hidden font-black uppercase tracking-[0.25em] text-[10px] md:text-xs text-white border-2 border-white rounded-full transition-all duration-500 hover:text-black shadow-2xl backdrop-blur-sm"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white transition-all duration-500 ease-out transform scale-x-0 group-hover:scale-x-100 origin-center z-0" />
                            <span className="relative z-10 flex items-center gap-2">
                                {config.buttonText}
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