"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-6 overflow-hidden">
            {/* Arka Planda Büyük Silik Yazı */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="text-[30vw] font-black text-gray-50/50 leading-none">404</span>
            </div>

            <div className="relative z-10 text-center space-y-12 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-400 block mb-4 italic italic">
                        Kusura Bakmayın
                    </span>
                    <h1 className="text-5xl md:text-7xl font-light uppercase tracking-tighter leading-none">
                        ARADIĞINIZ PARÇA <br />
                        <span className="font-serif italic text-gray-300">Bulunamadı.</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-sm md:text-base text-gray-500 font-medium uppercase tracking-tight leading-relaxed"
                >
                    Görünüşe göre yolunuzu kaybettiniz. <br />
                    Sizi özel seçkimize geri götürelim.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pt-10 flex flex-col md:flex-row items-center justify-center gap-12"
                >
                    <Link
                        href="/"
                        className="text-[11px] font-black uppercase tracking-[0.5em] border-b-2 border-black pb-2 hover:opacity-50 transition-all"
                    >
                        Anasayfa'ya Dön
                    </Link>
                    <Link
                        href="/shop"
                        className="text-[11px] font-black uppercase tracking-[0.5em] border-b-2 border-black pb-2 hover:opacity-50 transition-all"
                    >
                        Yeni Gelenleri Keşfet
                    </Link>
                </motion.div>

                {/* Alt Süsleme Çizgisi */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="h-[1px] bg-gray-100 mx-auto mt-20"
                />
            </div>
        </div>
    );
}