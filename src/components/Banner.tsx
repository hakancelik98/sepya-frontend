"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroBanner() {
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setOffsetY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative w-full h-[100vh] bg-gradient-to-b from-gray-900 to-black overflow-hidden">
            {/* Ortadaki içerik */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-10">
                <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
                    Nişantaşı Sanat
                </h1>
                <p className="mt-4 text-lg md:text-2xl max-w-2xl">
                    Sanatla buluş, yaratıcılığını özgür bırak.
                </p>
                <div className="mt-6 flex gap-4">
                    <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition">
                        Keşfet
                    </button>
                    <button className="border border-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black transition">
                        Sipariş Ver
                    </button>
                </div>
            </div>

            {/* Sol nesne */}
            <div
                className="absolute left-0 top-1/3"
                style={{ transform: `translateY(${offsetY * 0.3}px)` }}
            >
                <Image
                    src="/object-left.png"
                    alt="Left Object"
                    width={250}
                    height={250}
                    className="opacity-90"
                />
            </div>

            {/* Sağ nesne */}
            <div
                className="absolute right-0 top-1/2"
                style={{ transform: `translateY(-${offsetY * 0.2}px)` }}
            >
                <Image
                    src="/object-right.png"
                    alt="Right Object"
                    width={300}
                    height={300}
                    className="opacity-90"
                />
            </div>
        </section>
    );
}
