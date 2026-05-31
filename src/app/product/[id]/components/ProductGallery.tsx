"use client";
import { useState, useRef, useEffect } from "react";

export default function ProductGallery({ images, title }: { images: string[], title: string }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const isHorizontal = useRef<boolean | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const fixUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    };

    const goTo = (index: number) => {
        setActiveIndex(Math.max(0, Math.min(images.length - 1, index)));
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onTouchMove = (e: TouchEvent) => {
            if (isHorizontal.current === true) e.preventDefault();
        };
        el.addEventListener("touchmove", onTouchMove, { passive: false });
        return () => el.removeEventListener("touchmove", onTouchMove);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
        isHorizontal.current = null;
        setIsDragging(true);
        setDragOffset(0);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const dx = e.touches[0].clientX - startX.current;
        const dy = e.touches[0].clientY - startY.current;
        if (isHorizontal.current === null) {
            isHorizontal.current = Math.abs(dx) > Math.abs(dy);
        }
        if (!isHorizontal.current) return;
        if ((activeIndex === 0 && dx > 0) || (activeIndex === images.length - 1 && dx < 0)) {
            setDragOffset(dx * 0.2);
        } else {
            setDragOffset(dx);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (isHorizontal.current) {
            if (dragOffset < -50) goTo(activeIndex + 1);
            else if (dragOffset > 50) goTo(activeIndex - 1);
        }
        setDragOffset(0);
        isHorizontal.current = null;
    };

    if (!images || images.length === 0) return null;

    // px cinsinden offset: activeIndex * 100vw - dragOffset
    const translatePx = -(activeIndex * 100) + (dragOffset / (typeof window !== "undefined" ? window.innerWidth : 390)) * 100;

    return (
        <div className="flex flex-col gap-0 md:gap-6 select-none w-full max-w-4xl mx-auto">

            {/* Mobil slider — tam ekran genişliğinde, taşan kısım body tarafından kesilir */}
            <div
                ref={containerRef}
                className="-mt-8 md:mt-0 relative md:h-[600px] bg-white"
                style={{ marginLeft: "calc(-50vw + 50%)", width: "100vw" }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Şerit: her slide tam 100vw */}
                <div
                    className="flex items-start"
                    style={{
                        width: `${images.length * 100}vw`,
                        transform: `translateX(calc(${translatePx}vw))`,
                        transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
                        willChange: "transform",
                    }}
                >
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="flex items-start justify-center bg-white"
                            style={{ width: "100vw" }}
                        >
                            <img
                                src={fixUrl(img)}
                                alt={`${title} ${idx + 1}`}
                                className="w-full h-auto md:h-[600px] md:object-contain md:object-top block"
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>

                {/* Mobil İndikatör */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center md:hidden z-10 pointer-events-none">
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
                        onClick={() => goTo(idx)}
                        className={`relative w-24 h-28 transition-all duration-300 border-b-2 overflow-hidden ${
                            activeIndex === idx ? "border-black opacity-100 scale-105" : "border-transparent opacity-40 hover:opacity-100"
                        }`}
                    >
                        <img
                            src={fixUrl(img)}
                            alt={`Thumb ${idx}`}
                            className="w-full h-full object-cover"
                            draggable={false}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}