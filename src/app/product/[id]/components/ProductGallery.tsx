"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGallery({ images, title }: { images: string[], title: string }) {
    const [[page, direction], setPage] = useState([0, 0]);
    const activeIndex = ((page % images.length) + images.length) % images.length;

    const fixUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    };

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    const handleDragEnd = (_event: any, info: any) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold) paginate(1);
        else if (info.offset.x > swipeThreshold) paginate(-1);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 1,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 1,
        }),
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col gap-0 md:gap-6 select-none w-full max-w-4xl mx-auto">

            {/* ANA GÖRSEL ALANI */}
            <div className="relative overflow-hidden
                            -mt-8 md:mt-0
                            w-screen -ml-[50vw] left-1/2
                            md:w-full md:ml-0 md:left-0 md:h-[600px] md:aspect-auto bg-white">

                <div className="w-full relative h-full flex items-center justify-center">
                    <AnimatePresence initial={false} custom={direction} mode="sync">
                        <motion.img
                            key={page}
                            src={fixUrl(images[activeIndex])}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "tween", ease: "easeInOut", duration: 0.3 },
                                opacity: { duration: 0 },
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={handleDragEnd}
                            style={{ willChange: "transform" }}
                            className="w-full h-auto md:h-full md:absolute md:inset-0 md:object-contain block cursor-grab active:cursor-grabbing"
                        />
                    </AnimatePresence>
                </div>

                {/* Mobil Sayfa İndikatörü */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 md:hidden z-10">
                    <div className="bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full flex gap-2 border border-white/10">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    activeIndex === idx ? "w-5 bg-white" : "w-1.5 bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* MASAÜSTÜ ALT GALERİ */}
            <div className="hidden md:flex flex-row flex-wrap justify-center gap-4 px-4 mt-4 md:mt-0">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            const dir = idx > activeIndex ? 1 : -1;
                            setPage([idx, dir]);
                        }}
                        className={`relative w-24 h-28 transition-all duration-300 border-b-2 overflow-hidden ${
                            activeIndex === idx ? "border-black opacity-100 scale-105" : "border-transparent opacity-40 hover:opacity-100"
                        }`}
                    >
                        <img
                            src={fixUrl(img)}
                            alt={`Thumb ${idx}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}