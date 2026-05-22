"use client";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function AnnouncementBar() {
    const [messages, setMessages] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const assetUrl = process.env.NEXT_PUBLIC_ASSET_URL;

    // 1. Veriyi çek ve Client tarafında olduğumuzu işaretle
    useEffect(() => {
        setIsClient(true);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        fetch(`${baseUrl}/announcements`)
            .then((res) => res.json())
            .then((data) => {
                const clean = (data.content ?? "")
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean);
                setMessages(clean.length > 0 ? clean : ["Sepya Eşarp"]);
            })
            .catch(() => setMessages(["Sepya Eşarp"]));
    }, []);

    // 2. Animasyonu başlat (Yazılar yüklendiğinde)
    useEffect(() => {
        if (isClient && wrapperRef.current && messages.length > 0) {
            // İçeriğin genişliğinin 1/10'u kadar (10 kez tekrar ettiğimiz için)
            const singleSetWidth = wrapperRef.current.scrollWidth / 10;

            controls.start({
                x: -singleSetWidth,
                transition: {
                    duration: 24, // Akış hızı
                    ease: "linear",
                    repeat: Infinity,
                },
            });
        }
    }, [messages, isClient, controls]);

    // Sunucu tarafında hata almamak için boş div döndür
    if (!isClient) {
        return <div className="w-full bg-black h-9 border-b border-white/5" />;
    }

    const text = messages.join(" • ") + " • ";

    return (
        <div className="w-full bg-black text-white h-9 flex items-center overflow-hidden border-b border-white/5">
            <motion.div
                ref={wrapperRef}
                className="flex whitespace-nowrap"
                animate={controls}
                initial={{ x: 0 }}
            >
                {/* Senin önerin: Yazıyı 10 kez yan yana basarak boşluk riskini sıfırlıyoruz */}
                {[...Array(10)].map((_, i) => (
                    <span
                        key={i}
                        className="px-10 text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase inline-block"
                    >
                        {text}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}