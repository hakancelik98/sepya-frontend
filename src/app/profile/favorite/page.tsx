"use client";

import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingBag, ArrowLeft, Loader2, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

interface FavoriteProduct {
    favoriteId: number;
    product: {
        id: number;
        title: string;
        description: string;
        price: number;
        discountedPrice: number | null;
        imageUrl: string;
        hoverImageUrl?: string | null;
        stockQuantity: number;
        category: string;
        inStock: boolean;
        brand?: string;
        subtitle?: string;
        seasonLabel?: string;
    };
    addedAt: string;
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const { addToCart, openCart } = useCart();

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL;

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setFavorites(data);
            }
        } catch (error) {
            console.error("Favoriler yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (productId: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${ASSET_URL}/api/favorites/${productId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setFavorites(prev => prev.filter(fav => fav.product.id !== productId));
            }
        } catch (error) {
            console.error("Favorilerden çıkarılamadı:", error);
        }
    };

    const handleAddToCart = async (productId: number, isOutOfStock: boolean) => {
        if (isOutOfStock) {
            alert("Bu ürün şu anda stokta bulunmamaktadır");
            return;
        }

        try {
            await addToCart(productId, 1);
            openCart();
        } catch (error) {
            console.error("Sepete eklenemedi:", error);
        }
    };

    const formatUrl = (url: string | null | undefined) => {
        if (!url) return "/placeholder.jpg";
        if (url.startsWith("http")) return url;

        return `${ASSET_URL}${url.startsWith("/") ? url : `/${url}`}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="max-w-[1536px] mx-auto px-4 md:px-6 py-16">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6">
                        <ArrowLeft size={16} />
                        Ana Sayfaya Dön
                    </Link>
                </div>

                {/* Empty State */}
                <div className="text-center py-20">
                    <div className="mb-6">
                        <Heart size={64} className="mx-auto text-zinc-200" strokeWidth={1} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
                        Favorileriniz Boş
                    </h2>
                    <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm">
                        Beğendiğiniz ürünleri favorilerinize ekleyerek kolayca takip edebilir ve istediğiniz zaman geri dönebilirsiniz.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all"
                    >
                        Alışverişe Başla
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1536px] mx-auto px-4 md:px-6 py-8 md:py-12">
            {/* Header */}
            <div className="mb-10">
                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors mb-6">
                    <ArrowLeft size={14} />
                    Ana Sayfa
                </Link>

                <div className="flex flex-col items-center text-center">
                    <h1 className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-zinc-900 mb-2">
                        Favorilerim
                    </h1>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 uppercase tracking-wider">
                        <Heart size={12} className="fill-zinc-400" />
                        <span>{favorites.length} Ürün</span>
                    </div>
                    <div className="w-12 h-[1px] bg-black mt-4 opacity-20"></div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                <AnimatePresence mode="popLayout">
                    {favorites.map((item) => {
                        const isOutOfStock = item.product.stockQuantity <= 0;
                        const hasDiscount = item.product.discountedPrice && item.product.discountedPrice < item.product.price;
                        const isHovered = hoveredId === item.product.id;

                        return (
                            <motion.div
                                key={item.favoriteId}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="group/card"
                                onMouseEnter={() => setHoveredId(item.product.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden bg-[#f7f7f7]">

                                    {/* Season Label / Etiket */}
                                    {item.product.seasonLabel && !isOutOfStock && (
                                        <div className="absolute top-3 left-3 z-10 bg-red-700 text-white px-2 py-1 text-[9px] tracking-tighter uppercase font-medium">
                                            {item.product.seasonLabel}
                                        </div>
                                    )}

                                    {isOutOfStock && (
                                        <div className="absolute top-3 left-3 z-10 bg-gray-200 text-gray-600 px-2 py-1 text-[9px] tracking-tighter uppercase font-medium">
                                            Tükendi
                                        </div>
                                    )}

                                    {/* Product Image */}
                                    <Link href={`/product/${item.product.id}`} className="block aspect-[3/4] relative overflow-hidden">
                                        <Image
                                            src={formatUrl(item.product.imageUrl)}
                                            alt={item.product.title}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-cover transition-opacity duration-700 group-hover/card:opacity-0"
                                        />
                                        {item.product.hoverImageUrl && (
                                            <Image
                                                src={formatUrl(item.product.hoverImageUrl)}
                                                alt={`${item.product.title} hover`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                className="object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 absolute inset-0"
                                            />
                                        )}
                                    </Link>

                                    {/* Hover Add to Cart Button - Desktop */}
                                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 ease-in-out z-20 hidden md:block">
                                        {isOutOfStock ? (
                                            <button
                                                onClick={() => alert(`"${item.product.title}" için stok bildirimi açıldı!`)}
                                                className="w-full bg-white/90 backdrop-blur-md text-black py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white transition-colors"
                                            >
                                                <Bell size={12} /> Gelince Haber Ver
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAddToCart(item.product.id, isOutOfStock)}
                                                className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
                                            >
                                                Sepete Ekle
                                            </button>
                                        )}
                                    </div>

                                    {/* Remove from Favorites Button */}
                                    <button
                                        onClick={() => handleRemoveFavorite(item.product.id)}
                                        className="absolute top-3 right-3 z-10 text-red-500 hover:scale-110 transition-transform"
                                    >
                                        <Heart size={18} strokeWidth={1.5} className="fill-red-500" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="mt-4 text-center px-1">
                                    {/* Subtitle */}
                                    {item.product.subtitle && (
                                        <span className="block text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-1 font-light">
                                            {item.product.subtitle}
                                        </span>
                                    )}

                                    {/* Title */}
                                    <Link href={`/product/${item.product.id}`} className="block group/title">
                                        <h3 className="text-[11px] md:text-[12px] font-medium tracking-wider uppercase text-gray-700 line-clamp-1 leading-tight mb-1 transition-colors group-hover/title:text-black">
                                            {item.product.title}
                                        </h3>
                                    </Link>

                                    {/* Price */}
                                    <div className="flex flex-col items-center gap-0.5">
                                        {hasDiscount ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 line-through text-[14px]">
                                                    {item.product.price.toLocaleString('tr-TR')} TL
                                                </span>
                                                <span className="text-red-600 font-bold text-[14px]">
                                                    {item.product.discountedPrice!.toLocaleString('tr-TR')} TL
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-900 font-bold text-[13px]">
                                                {item.product.price.toLocaleString('tr-TR')} TL
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Bottom Actions - Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-100 shadow-lg z-30">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                        {favorites.length} favori ürün
                    </span>
                    <Link
                        href="/products"
                        className="px-4 py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider"
                    >
                        Alışverişe Devam
                    </Link>
                </div>
            </div>
        </div>
    );
}