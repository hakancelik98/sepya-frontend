"use client";
import { useEffect, useRef, useState } from "react";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
    const [index, setIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const isHorizontal = useRef<boolean | null>(null);
    const currentIndex = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);

    const fixUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    };

    useEffect(() => {
        images?.forEach((img) => {
            const i = new Image();
            i.src = fixUrl(img);
        });
    }, [images]);

    const goTo = (i: number) => {
        if (i < 0 || i >= images.length) return;
        setIndex(i);
        currentIndex.current = i;
    };

    const onTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
        isHorizontal.current = null;
        setIsDragging(true);
        setDragX(0);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - startX.current;
        const dy = e.touches[0].clientY - startY.current;

        if (isHorizontal.current === null) {
            isHorizontal.current = Math.abs(dx) > Math.abs(dy);
        }
        if (!isHorizontal.current) return;

        e.stopPropagation();
        const resistance = (currentIndex.current === 0 && dx > 0) || (currentIndex.current === images.length - 1 && dx < 0);
        setDragX(resistance ? dx * 0.2 : dx);
    };

    const onTouchEnd = () => {
        setIsDragging(false);
        if (isHorizontal.current) {
            if (dragX < -70) goTo(currentIndex.current + 1);
            else if (dragX > 70) goTo(currentIndex.current - 1);
        }
        setDragX(0);
        isHorizontal.current = null;
    };

    if (!images?.length) return null;

    const containerWidth = trackRef.current?.offsetWidth || (typeof window !== "undefined" ? window.innerWidth : 390);
    const offsetPx = -(index * containerWidth) + dragX;

    return (
        <div className="w-full max-w-4xl mx-auto select-none flex flex-col gap-0 md:gap-6">

            {/* VIEWPORT — mobilde header'a yapışık, tam genişlik */}
            <div
                className="-mt-8 md:mt-0 relative overflow-hidden bg-white"
                style={{ marginLeft: "calc(-50vw + 50%)", width: "100vw" }}
            >
                {/* TRACK */}
                <div
                    ref={trackRef}
                    className="flex"
                    style={{
                        width: `${images.length * 100}vw`,
                        transform: `translateX(${offsetPx}px)`,
                        transition: isDragging ? "none" : "transform 0.32s cubic-bezier(0.25, 1, 0.5, 1)",
                        willChange: "transform",
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 bg-white flex items-start justify-center"
                            style={{ width: "100vw" }}
                        >
                            <img
                                src={fixUrl(img)}
                                alt={`${title} ${i + 1}`}
                                className="w-full h-auto md:h-[600px] md:object-contain md:object-top block"
                                draggable={false}
                                loading="eager"
                                decoding="sync"
                            />
                        </div>
                    ))}
                </div>

                {/* DOTS — mobilde görsel üzerinde */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center md:hidden z-10 pointer-events-none">
                    <div className="bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full flex gap-2 border border-white/10">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === i ? "w-5 bg-white" : "w-1.5 bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* THUMBS — masaüstü */}
            <div className="hidden md:flex justify-center gap-3 mt-4 md:mt-0">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-24 h-28 overflow-hidden border-b-2 transition-all duration-300 ${
                            index === i
                                ? "border-black opacity-100 scale-105"
                                : "border-transparent opacity-40 hover:opacity-100"
                        }`}
                    >
                        <img
                            src={fixUrl(img)}
                            className="w-full h-full object-cover"
                            draggable={false}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}