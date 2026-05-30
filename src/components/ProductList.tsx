"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import AuthModal from "@/components/AuthModal";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [loadingFavoriteId, setLoadingFavoriteId] = useState<number | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${BASE_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                checkFavoritesBatch(data);
            })
            .catch((err) => console.error("Veri çekme hatası:", err));
    }, []);

    // Toplu favori kontrolü - tek istekte tüm ürünleri kontrol et
    const checkFavoritesBatch = async (products: any[]) => {
        const token = localStorage.getItem("token");
        if (!token || products.length === 0) return;

        const ids = products.map(p => p.id).join(',');
        try {
            const res = await fetch(`${BASE_URL}/favorites/check-batch?productIds=${ids}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFavoriteIds(data);
            }
        } catch (err) {
            console.error("Batch favori hatası:", err);
        }
    };

    // Toggle favori - favoriye ekleme/çıkarma
    const handleToggleFavorite = async (productId: number) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsAuthModalOpen(true);
            return;
        }

        setLoadingFavoriteId(productId);

        try {
            const res = await fetch(`${BASE_URL}/favorites/toggle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });

            if (res.ok) {
                const data = await res.json();

                if (data.isFavorite) {
                    // Favoriye eklendi
                    setFavoriteIds([...favoriteIds, productId]);
                } else {
                    // Favoriden çıkarıldı
                    setFavoriteIds(favoriteIds.filter(id => id !== productId));
                }
            }
        } catch (error) {
            console.error("Favori işlemi başarısız:", error);
        } finally {
            setLoadingFavoriteId(null);
        }
    };

    return (
        <>
            <div className="w-full max-w-[1500px] mx-auto min-h-screen">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 p-2 md:p-10">
                    {products.map((product: any) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            discountedPrice={product.discountedPrice}
                            seasonLabel={product.seasonLabel}
                            imageUrl={product.imageUrl}
                            hoverImageUrl={product.hoverImageUrl}
                            brand={product.brand}
                            stockQuantity={product.stockQuantity}
                            subtitle={product.subtitle}
                            isFavorite={favoriteIds.includes(product.id)}
                            onToggleFavorite={handleToggleFavorite}
                            isLoading={loadingFavoriteId === product.id}
                        />
                    ))}
                </div>
            </div>

            {isAuthModalOpen && (
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    initialView="login"
                />
            )}
        </>
    );
}