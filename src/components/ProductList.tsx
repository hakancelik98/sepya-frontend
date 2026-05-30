"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]); // Favori listesini burada tutacağız

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${BASE_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                // Ürünler gelince, favori kontrolünü toplu yap
                checkFavoritesBatch(data);
            })
            .catch((err) => console.error("Veri çekme hatası:", err));
    }, []);

    // 16 istek yerine tek bir istek atan fonksiyon
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
                setFavoriteIds(data); // Favori olan ID'leri set et
            }
        } catch (err) {
            console.error("Batch favori hatası:", err);
        }
    };

    return (
        <div className="w-full max-w-[1500px] mx-auto min-h-screen">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 p-2 md:p-10">
                {products.map((product: any) => (
                    <ProductCard
                        key={product.id}
                        {...product}
                        // Favori durumunu yukarıdan gönderiyoruz
                        isFavorite={favoriteIds.includes(product.id)}
                    />
                ))}
            </div>
        </div>
    );
}