"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import FavoriteButton from "@/components/FavoriteButton";

export default function AdaStyleSlider() {
    const [items, setItems] = useState<any[]>([]);
    const [design, setDesign] = useState({
        title: "Yeni Koleksiyon",
        titleColor: "#000000",
        titleSize: "24",
        subTitle: "",
        subTitleColor: "#64748b",
        subTitleSize: "14"
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isMoving = useRef(false);

    const { addToCart, openCart } = useCart();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const API_ASSET = process.env.NEXT_PUBLIC_ASSET_URL;

    const fixUrl = (path: string) => {
        if (!path) return "/placeholder.jpg";
        return path.startsWith("http") ? path : `${API_ASSET}${path.startsWith("/") ? "" : "/"}${path}`;
    };

    useEffect(() => {
        fetch(`${API_BASE}/slider`)
            .then(res => res.json())
            .then(data => {
                setDesign({
                    title: data.title || "Yeni Koleksiyon",
                    titleColor: data.titleColor || "#000000",
                    titleSize: data.titleSize || "24",
                    subTitle: data.subTitle || "",
                    subTitleColor: data.subTitleColor || "#64748b",
                    subTitleSize: data.subTitleSize || "14"
                });

                const active = (data.items || []).filter((d: any) => d.product).map((d: any) => ({
                    ...d.product,
                    tag: d.tag,
                    seasonLabel: d.product.seasonLabel || d.tag || "",
                    productSubtitle: d.product.subtitle || d.subtitle || ""
                }));

                // ARTIK ÜRÜNLERİ ÇOĞALTMIYORUZ: Sadece gelen net listeyi neyse onu koyuyoruz
                setItems(active);
            })
            .catch(err => console.error("Slider fetch error:", err));
    }, []);

    // Masaüstündeki butonlar için normal kaydırma adımı
    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current || isMoving.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth / (window.innerWidth < 768 ? 2 : 4);

        isMoving.current = true;
        container.style.scrollBehavior = 'smooth';
        container.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount });

        setTimeout(() => {
            isMoving.current = false;
        }, 400);
    };

    if (items.length === 0) return null;

    return (
        <section className="py-12 bg-white select-none overflow-hidden">
            <div className="w-full max-w-[1536px] mx-auto px-0 md:px-6 relative group">

                {/* DİNAMİK BAŞLIK ALANI */}
                <div className="flex flex-col items-center mb-8 text-center px-4">
                    <h2
                        className="font-light tracking-[0.2em] uppercase leading-tight text-xl md:text-2xl"
                        style={{ color: design.titleColor }}
                    >
                        {design.title}
                    </h2>
                    {design.subTitle && (
                        <p
                            className="mt-2 uppercase tracking-widest font-medium text-xs md:text-sm"
                            style={{ color: design.subTitleColor }}
                        >
                            {design.subTitle}
                        </p>
                    )}
                    <div className="w-12 h-[1px] bg-black mt-4"></div>
                </div>

                <button onClick={() => scroll('left')} className="hidden md:flex absolute left-4 top-[45%] z-20 w-11 h-11 items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white">
                    <ChevronLeft size={20} strokeWidth={1} />
                </button>
                <button onClick={() => scroll('right')} className="hidden md:flex absolute right-4 top-[45%] z-20 w-11 h-11 items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white">
                    <ChevronRight size={20} strokeWidth={1} />
                </button>

                {/* SLIDER KAPSAYICISI */}
                <div
                    ref={scrollContainerRef}
                    // onScroll tetikleyicisini kaldırdık, yapay atlamalar tamamen son buldu.
                    // overscroll-x-contain: Sona dayandığında tarayıcının tüm sayfayı geri fırlatmasını önler, duvara çarpar.
                    className="flex overflow-x-auto gap-[2px] md:gap-6 pb-4 snap-x mandatory scroll-smooth overscroll-x-contain"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    {items.map((item, index) => {
                        const isOutOfStock = item.stockQuantity <= 0;
                        const hasDiscount = item.discountedPrice && item.discountedPrice < item.price;

                        return (
                            <div
                                key={`${item.id}-${index}`}
                                className="flex-none w-[calc(50%-1px)] md:w-[calc(25%-18px)] snap-start group/card"
                            >
                                <div className="relative overflow-hidden bg-[#f7f7f7]">

                                    {item.seasonLabel && !isOutOfStock && (
                                        <div className="absolute top-2 left-2 z-10 bg-red-700 text-white px-2 py-0.5 text-[9px] tracking-tighter uppercase font-medium">
                                            {item.seasonLabel}
                                        </div>
                                    )}

                                    {isOutOfStock && (
                                        <div className="absolute top-2 left-2 z-10 bg-gray-200 text-gray-600 px-2 py-0.5 text-[9px] tracking-tighter uppercase font-medium">
                                            Tükendi
                                        </div>
                                    )}

                                    <Link href={`/product/${item.id}`} className="block aspect-[3/4] relative overflow-hidden">
                                        <img
                                            src={fixUrl(item.imageUrl)}
                                            className={`w-full h-full object-cover transition-opacity duration-500 ${item.hoverImageUrl && 'group-hover/card:opacity-0'}`}
                                            alt={item.title}
                                            draggable={false}
                                        />
                                        {item.hoverImageUrl && (
                                            <img
                                                src={fixUrl(item.hoverImageUrl)}
                                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                                                alt={`${item.title} hover`}
                                                draggable={false}
                                            />
                                        )}
                                    </Link>

                                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 ease-in-out z-20 hidden md:block">
                                        {isOutOfStock ? (
                                            <button className="w-full bg-white/90 backdrop-blur-md text-black py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                                Gelince Haber Ver
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { addToCart(item.id, 1); openCart(); }}
                                                className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800"
                                            >
                                                Sepete Ekle
                                            </button>
                                        )}
                                    </div>

                                    <FavoriteButton productId={item.id} className="absolute top-2 right-2 z-10" />
                                </div>

                                <div className="mt-3 text-center px-2">
                                    {item.productSubtitle && (
                                        <span className="block text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-0.5 font-light">
                                            {item.productSubtitle}
                                        </span>
                                    )}

                                    <h3 className="text-[11px] md:text-[12px] font-normal tracking-wider uppercase text-gray-700 line-clamp-1 leading-tight mb-1">
                                        {item.title}
                                    </h3>
                                    <div className="flex flex-col items-center gap-0.5">
                                        {hasDiscount ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 line-through text-[12px] md:text-[14px]">
                                                    {item.price.toLocaleString('tr-TR')} TL
                                                </span>
                                                <span className="text-red-600 font-medium text-[12px] md:text-[14px]">
                                                    {item.discountedPrice.toLocaleString('tr-TR')} TL
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-900 font-medium text-[12px] md:text-[13px]">
                                                {item.price.toLocaleString('tr-TR')} TL
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <style jsx>{`
                div { -ms-overflow-style: none; scrollbar-width: none; }
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </section>
    );
}