"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // router.push yerine Link kullanıyoruz

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

    // DOM yapısının ilk renderda kaymaması ve hydration uyuşmazlığı yaratmaması için
    // config gelene kadar iskelet (skeleton) yapıyı koruyoruz.
    if (!config) {
        return <section className="w-full h-[35vh] md:h-screen min-h-[300px] md:min-h-[700px] bg-black" />;
    }

    const bgImage = config.imageUrl.startsWith("http")
        ? config.imageUrl
        : `${process.env.NEXT_PUBLIC_ASSET_URL}${config.imageUrl}`;

    return (
        <section
            className="relative w-full h-[35vh] md:h-screen min-h-[300px] md:min-h-[700px] overflow-hidden bg-black"
            suppressHydrationWarning // Sunucu-istemci arasındaki ufak tefek uyuşmazlıkları görmezden gelmesini söyler
        >
            {/* Arka Plan */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 transition-all duration-1000"
                style={{ backgroundImage: `url('${bgImage}')` }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

            <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
                {/*
                  isMounted kontrolünü animasyonun başladığı yere çekiyoruz.
                  Böylece React DOM'u baştan aşağı silip yaratmak yerine sadece içeriği canlandırıyor.
                */}
                {isMounted && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="text-white/80 text-[14px] md:text-sm font-bold tracking-[0.4em] uppercase mb-3 md:mb-6 block">
                            {config.upperTitle}
                        </span>
                        <h1 className="text-white text-3xl md:text-8xl font-black uppercase leading-[0.9] mb-4 md:mb-8 tracking-tighter">
                            {config.mainTitle} <br />
                            <span className="font-light italic">{config.italicTitle}</span>
                        </h1>

                        {/*
                          Hatalı 'removeChild' durumunu engellemek için en temiz yol:
                          onClick + router.push yerine doğrudan Next.js'in kendi <Link> bileşenini
                          buton sınıflarıyla giydirip kullanmaktır.
                        */}
                        <Link
                            href={config.buttonLink || "/shop"}
                            className="inline-block px-7 py-3 md:px-12 md:py-5 bg-white text-black font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-black hover:text-white transition-all duration-500 shadow-2xl"
                        >
                            {config.buttonText}
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}