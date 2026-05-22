"use client";
import { use, useState, useEffect } from "react";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import RecommendedProducts from "./components/RecommendedProducts";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API_BASE}/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-[0.4em] text-[10px]">Yükleniyor...</div>;
    if (!product) return null;

    const allImages = [
        product.imageUrl,
        product.hoverImageUrl,
        ...(product.galleryImageUrls || [])
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="max-w-[1500px] mx-auto px-0 md:px-6 lg:px-16">
                {/* gap-0: Mobilde galeri ile info arasındaki boşluğu sıfırlar.
                   md:gap-20: Masaüstünde (medium ve üstü) ideal boşluğu geri getirir.
                */}
                <div className="flex flex-col lg:flex-row gap-0 md:gap-20 items-start">

                    {/* GALERİ ALANI: %50 */}
                    <div className="w-full lg:w-[50%] lg:sticky lg:top-28 pt-0 -mt-4 md:mt-0">
                        <ProductGallery images={allImages} title={product.title} />
                    </div>

                    {/* INFO ALANI: %50 */}
                    {/* -mt-6: Mobilde görselin hemen altına yapışması için yukarı çektik.
                        md:mt-0: Masaüstünde hizalamayı normale döndürdük.
                        px-6: Mobilde metinler ekrana yapışmasın diye iç boşluk verdik.
                    */}
                    <aside className="w-full lg:w-[50%] mt-6 md:mt-0 px-6 md:px-0">
                        <ProductInfo product={product} />
                    </aside>

                </div>

                {/* Önerilen ürünler alanı için normal padding'i tekrar sağlıyoruz */}
                <div className="px-6 md:px-0 mt-10">
                    <RecommendedProducts
                        categoryId={product.category?.id}
                        currentProductId={product.id}
                    />
                </div>
            </div>
        </div>
    );
}