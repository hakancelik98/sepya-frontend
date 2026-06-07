// app/product/[id]/ProductPageClient.tsx
"use client";
import { useState, useEffect } from "react";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import RecommendedProducts from "./components/RecommendedProducts";
import ProductJsonLd from "./ProductJsonLd";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_ASSET_URL || "https://sepyaesarp.com";

export default function ProductPageClient({
                                              slugOrId,
                                              initialProduct,
                                          }: {
    slugOrId: string;
    initialProduct: any;
}) {
    const [product, setProduct] = useState<any>(initialProduct);
    const [loading, setLoading] = useState(!initialProduct);

    useEffect(() => {
        if (initialProduct) return; // server'dan geldiyse tekrar çekme
        setLoading(true);
        fetch(`${API_BASE}/products/${slugOrId}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => setProduct(data))
            .catch(err => console.error("Ürün yüklenemedi:", err))
            .finally(() => setLoading(false));
    }, [slugOrId, initialProduct]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-[0.4em] text-[10px]">
            Yükleniyor...
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-[0.4em] text-[10px] text-zinc-400">
            Ürün bulunamadı
        </div>
    );

    const allImages = [
        product.imageUrl,
        product.hoverImageUrl,
        ...(product.galleryImageUrls || [])
    ].filter(Boolean);

    const imageUrl = product.imageUrl?.startsWith("http")
        ? product.imageUrl
        : `${SITE_URL}${product.imageUrl}`;

    return (
        <>
            {/* JSON-LD Structured Data */}
            <ProductJsonLd product={product} imageUrl={imageUrl} />

            <div className="min-h-screen bg-white pt-[50px] md:pt-24 pb-20">
                <div className="max-w-[1500px] mx-auto px-0 md:px-6 lg:px-16">
                    <div className="flex flex-col lg:flex-row gap-0 md:gap-20 items-start">
                        <div className="w-full lg:w-[50%] lg:sticky lg:top-28 pt-0 -mt-4 md:mt-0">
                            <ProductGallery images={allImages} title={product.title} />
                        </div>
                        <aside className="w-full lg:w-[50%] mt-6 md:mt-0 px-6 md:px-0">
                            <ProductInfo product={product} />
                        </aside>
                    </div>
                    <div className="mt-10">
                        <RecommendedProducts
                            categoryId={product.category?.id}
                            currentProductId={product.id}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}