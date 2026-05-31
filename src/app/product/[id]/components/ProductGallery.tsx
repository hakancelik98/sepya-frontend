"use client";
import { useEffect, useRef, useState } from "react";

export default function ProductGallery({
                                           images,
                                           title,
                                       }: {
    images: string[];
    title: string;
}) {
    const [index, setIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const startX = useRef(0);
    const currentIndex = useRef(0);

    const fixUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;

        const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;

        return `${baseUrl}${cleanPath}`;
    };

    // preload images
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
        setIsDragging(true);
        startX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;

        const x = e.touches[0].clientX;
        const diff = x - startX.current;

        setDragX(diff);
    };

    const onTouchEnd = () => {
        setIsDragging(false);

        const threshold = 70;

        if (dragX > threshold) {
            goTo(currentIndex.current - 1);
        } else if (dragX < -threshold) {
            goTo(currentIndex.current + 1);
        }

        setDragX(0);
    };

    if (!images || images.length === 0) return null;

    const percentOffset = -index * 100 + (dragX / window.innerWidth) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto select-none">

            {/* VIEWPORT */}
            <div className="relative overflow-hidden w-full">

                {/* TRACK */}
                <div
                    className="flex"
                    style={{
                        width: `${images.length * 100}%`,
                        transform: `translateX(${percentOffset}%)`,
                        transition: isDragging
                            ? "none"
                            : "transform 0.35s ease-out",
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="w-full flex-shrink-0 bg-white"
                        >
                            <div className="relative w-full aspect-[3/4] md:h-[600px] md:aspect-auto">
                                <img
                                    src={fixUrl(img)}
                                    alt={`${title} ${i + 1}`}
                                    className="absolute inset-0 w-full h-full object-contain object-top"
                                    draggable={false}
                                    loading="eager"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DOTS */}
            <div className="flex justify-center mt-3 gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === i
                                ? "w-5 bg-black"
                                : "w-2 bg-black/30"
                        }`}
                    />
                ))}
            </div>

            {/* THUMBNAILS */}
            <div className="hidden md:flex justify-center gap-3 mt-4">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-24 h-28 overflow-hidden border-b-2 transition-all ${
                            index === i
                                ? "border-black opacity-100 scale-105"
                                : "border-transparent opacity-40"
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