"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Bell, Heart } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton"; // FavoriteButton import edildi

interface ProductProps {
    id: number;
    title: string;
    price: number;
    discountedPrice?: number;
    seasonLabel?: string;
    imageUrl: string;
    hoverImageUrl?: string | null;
    brand?: { name: string };
    stockQuantity?: number;
    subtitle?: string;
}

export default function ProductCard({
                                        id,
                                        title,
                                        price,
                                        discountedPrice,
                                        seasonLabel,
                                        imageUrl,
                                        hoverImageUrl,
                                        stockQuantity = 0,
                                        subtitle
                                    }: ProductProps) {
    const [displayImage, setDisplayImage] = useState(imageUrl);
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart, openCart } = useCart();

    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    useEffect(() => {
        setDisplayImage(imageUrl);
    }, [imageUrl]);

    // Fiyat Güvenlik Kontrolleri
    const safePrice = Number(price) || 0;
    const safeDiscountedPrice = Number(discountedPrice) || 0;
    const hasDiscount = safeDiscountedPrice > 0 && safeDiscountedPrice < safePrice;

    // STOK KONTROLÜ
    const isOutOfStock = stockQuantity === 0;

    const formatUrl = (url: string | null | undefined) => {
        if (!url) return "/placeholder.jpg";
        return url.startsWith("http")
            ? url
            : `${ASSET_BASE}${url}`;
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOutOfStock) {
            alert("Bu ürün şu anda stokta bulunmamaktadır");
            return;
        }

        try {
            await addToCart(id, 1);
            openCart();
        } catch (err) {
            console.error("Sepete ekleme hatası:", err);
        }
    };

    const handleNotifyMe = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`"${title}" ürünü için stok bildirimi açıldı!`);
    };

    return (
        <div
            className="group/card relative block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* GÖRSEL ALANI */}
            <div className="relative overflow-hidden bg-[#f7f7f7]">

                {/* SeasonLabel / Etiket */}
                {seasonLabel && !isOutOfStock && (
                    <div className="absolute top-3 left-3 z-10 bg-red-700 text-white px-2 py-1 text-[9px] tracking-tighter uppercase font-medium">
                        {seasonLabel}
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute top-3 left-3 z-10 bg-gray-200 text-gray-600 px-2 py-1 text-[9px] tracking-tighter uppercase font-medium">
                        Tükendi
                    </div>
                )}

                <Link href={`/product/${id}`} className="block aspect-[3/4] relative overflow-hidden">
                    <Image
                        src={formatUrl(displayImage)}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-opacity duration-700 group-hover/card:opacity-0"
                        priority
                    />
                    {hoverImageUrl && (
                        <Image
                            src={formatUrl(hoverImageUrl)}
                            alt={`${title} hover`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 absolute inset-0"
                        />
                    )}
                </Link>

                {/* HOVER BUTON - Desktop */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 ease-in-out z-20 hidden md:block">
                    {isOutOfStock ? (
                        <button
                            onClick={handleNotifyMe}
                            className="w-full bg-white/90 backdrop-blur-md text-black py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white transition-colors"
                        >
                            <Bell size={12} /> Gelince Haber Ver
                        </button>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
                        >
                            Sepete Ekle
                        </button>
                    )}
                </div>

                {/* FAVORİ BUTONU - FavoriteButton Component Kullanıldı */}
                <FavoriteButton productId={id} className="absolute top-3 right-3 z-10" />
            </div>

            {/* BİLGİ ALANI */}
            <div className="mt-4 text-center px-1">
                {/* Ürün Alt Başlığı */}
                {subtitle && (
                    <span className="block text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-1 font-light">
                        {subtitle}
                    </span>
                )}

                <Link href={`/product/${id}`} className="block group/title">
                    <h3 className="text-[11px] md:text-[12px] font-medium tracking-wider uppercase text-gray-700 line-clamp-1 leading-tight mb-1 transition-colors group-hover/title:text-black">
                        {title}
                    </h3>
                </Link>

                <div className="flex flex-col items-center gap-0.5">
                    {hasDiscount ? (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-[14px]">
                                {safePrice.toLocaleString('tr-TR')} TL
                            </span>
                            <span className="text-red-600 font-bold text-[14px]">
                                {safeDiscountedPrice.toLocaleString('tr-TR')} TL
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-900 font-bold text-[13px]">
                            {safePrice.toLocaleString('tr-TR')} TL
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}