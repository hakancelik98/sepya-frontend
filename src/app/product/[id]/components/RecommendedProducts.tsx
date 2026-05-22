"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Bell } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import FavoriteButton from "@/components/FavoriteButton"; // Import edildi

export default function RecommendedProducts({ categoryId, currentProductId }: { categoryId: number, currentProductId: number }) {
    const [products, setProducts] = useState<any[]>([]);
    const { addToCart, openCart } = useCart();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    useEffect(() => {
        fetch(`${API_BASE}/products?categoryId=${categoryId}`)
            .then(res => res.json())
            .then(data => {
                let allProducts = data.content || data;
                let filtered = allProducts.filter((p: any) => String(p.id) !== String(currentProductId));
                setProducts(filtered.sort(() => 0.5 - Math.random()).slice(0, 4));
            });
    }, [categoryId, currentProductId]);

    const fixUrl = (path: string) => {
        if (!path) return "/placeholder.jpg";
        if (path.startsWith("http")) return path;

        return `${ASSET_BASE}${path.startsWith("/") ? path : `/${path}`}`;
    };

    return (
        <section className="py-8 bg-white border-t border-zinc-50">
            <div className="max-w-[1536px] mx-auto px-4 md:px-6">

                {/* SLIDER STİLİ BAŞLIK */}
                <div className="flex flex-col items-center mb-12 text-center">
                    <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2 italic">Keşfetmeye Devam Et</span>
                    <h2 className="font-serif italic lowercase text-[40px] text-zinc-900">
                        Sizin İçin Seçtiklerimiz
                    </h2>
                    <div className="w-12 h-[1px] bg-black mt-6 opacity-20"></div>
                </div>

                {/* SLIDER KART YAPISI (GRID) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
                    {products.map((item) => {
                        const isOutOfStock = item.stockQuantity <= 0;
                        const hasDiscount = item.discountedPrice && item.discountedPrice < item.price;

                        return (
                            <div key={item.id} className="group/card flex flex-col">
                                <div className="relative overflow-hidden bg-[#f7f7f7]">

                                    {/* SeasonLabel / Etiket */}
                                    {item.tag && !isOutOfStock && (
                                        <div className="absolute top-3 left-3 z-10 bg-red-700 text-white px-2 py-1 text-[9px] tracking-tighter uppercase font-medium">
                                            {item.tag}
                                        </div>
                                    )}

                                    {isOutOfStock && (
                                        <div className="absolute top-3 left-3 z-10 bg-zinc-200 text-zinc-600 px-2 py-1 text-[9px] tracking-tighter uppercase font-medium">
                                            Tükendi
                                        </div>
                                    )}

                                    {/* Görsel Alanı ve Hover Efekti */}
                                    <Link href={`/product/${item.id}`} className="block aspect-[3/4] relative overflow-hidden">
                                        <img
                                            src={fixUrl(item.imageUrl)}
                                            className={`w-full h-full object-cover transition-opacity duration-700 ${item.hoverImageUrl && 'group-hover/card:opacity-0'}`}
                                            alt={item.title}
                                        />
                                        {item.hoverImageUrl && (
                                            <img
                                                src={fixUrl(item.hoverImageUrl)}
                                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 scale-105 group-hover/card:scale-100"
                                                alt={`${item.title} hover`}
                                            />
                                        )}
                                    </Link>

                                    {/* Sepete Ekle Butonu (Slide-up) */}
                                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 ease-in-out z-20 hidden md:block">
                                        {isOutOfStock ? (
                                            <button className="w-full bg-white/90 backdrop-blur-md text-zinc-900 py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                                <Bell size={12} /> Gelince Haber Ver
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { addToCart(item.id, 1); openCart(); }}
                                                className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
                                            >
                                                Sepete Ekle
                                            </button>
                                        )}
                                    </div>

                                    {/* FAVORİ BUTONU - FavoriteButton Component */}
                                    <FavoriteButton productId={item.id} className="absolute top-3 right-3 z-10 pointer-events-auto" />
                                </div>

                                {/* Ürün Bilgileri (Slider Tipografisi) */}
                                <div className="mt-4 text-center px-1">
                                    <span className="block text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-[0.15em] mb-1 font-light">
                                        {item.brand || "Koleksiyon"}
                                    </span>

                                    <h3 className="text-[11px] md:text-[12px] font-medium tracking-wider uppercase text-zinc-700 line-clamp-1 leading-tight mb-1">
                                        {item.title}
                                    </h3>

                                    <div className="flex flex-col items-center gap-0.5">
                                        {hasDiscount ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-400 line-through text-[13px]">
                                                    {Number(item.price).toLocaleString('tr-TR')} TL
                                                </span>
                                                <span className="text-red-600 font-bold text-[13px]">
                                                    {Number(item.discountedPrice).toLocaleString('tr-TR')} TL
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-zinc-900 font-bold text-[13px]">
                                                {Number(item.price).toLocaleString('tr-TR')} TL
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}