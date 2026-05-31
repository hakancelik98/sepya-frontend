"use client";
import { useRef, useState, useEffect } from "react";

export default function ProductGallery({
                                           images,
                                           title,
                                       }: {
    images: string[];
    title: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const fixUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;

        const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;

        return `${baseUrl}${cleanPath}`;
    };

    // 🔥 PRELOAD (flicker fix)
    useEffect(() => {
        if (!images?.length) return;

        images.forEach((img) => {
            const image = new Image();
            image.src = fixUrl(img);
        });
    }, [images]);

    // 🔥 SCROLL TRACK (stable index)
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let rafId: number;

        const onScroll = () => {
            cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const slideWidth =
                    el.firstElementChild?.clientWidth || el.clientWidth;

                const index = Math.round(el.scrollLeft / slideWidth);

                setActiveIndex((prev) =>
                    prev === index ? prev : index
                );
            });
        };

        el.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            el.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafId);
        };
    }, []);

    const goTo = (index: number) => {
        const el = scrollRef.current;
        if (!el) return;

        const slideWidth =
            el.firstElementChild?.clientWidth || el.clientWidth;

        el.scrollTo({
            left: index * slideWidth,
            behavior: "smooth",
        });

        setActiveIndex(index);
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col select-none w-full max-w-4xl mx-auto">

            {/* GALERİ */}
            <div
                className="relative"
                style={{
                    marginLeft: "calc(-50vw + 50%)",
                    width: "100vw",
                }}
            >
                <div
                    ref={scrollRef}
                    className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth"
                    style={{
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "none",
                    }}
                >
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 snap-start bg-white"
                            style={{
                                width: "100vw",
                            }}
                        >
                            {/* 🔥 CLS FIX: sabit layout */}
                            <div className="relative w-full aspect-[3/4] md:h-[600px] md:aspect-auto">
                                <img
                                    src={fixUrl(img)}
                                    alt={`${title} ${idx + 1}`}
                                    className="absolute inset-0 w-full h-full object-contain object-top"
                                    draggable={false}
                                    loading="eager"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* MOBİL DOTS */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center md:hidden z-10 pointer-events-none">
                    <div className="bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full flex gap-2 border border-white/10">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    activeIndex === idx
                                        ? "w-5 bg-white"
                                        : "w-1.5 bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* THUMBNAILS */}
            <div className="hidden md:flex flex-row flex-wrap justify-center gap-4 px-4 mt-4">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => goTo(idx)}
                        className={`relative w-24 h-28 overflow-hidden transition-all duration-300 border-b-2 ${
                            activeIndex === idx
                                ? "border-black opacity-100 scale-105"
                                : "border-transparent opacity-40 hover:opacity-100"
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