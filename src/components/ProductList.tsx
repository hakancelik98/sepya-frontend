"use client";
import { useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";

export default function ProductList() {
    const [products, setProducts] = useState<any[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
    const ITEMS_PER_PAGE = 12;

    // checkFavoritesBatch'ı useCallback ile sarla
    const checkFavoritesBatch = useCallback(async (productsData: any[]) => {
        const token = localStorage.getItem("token");
        if (!token || productsData.length === 0) return;

        const ids = productsData.map(p => p.id).join(',');
        try {
            const res = await fetch(`${BASE_URL}/favorites/check-batch?productIds=${ids}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data: number[] = await res.json();
                setFavoriteIds(prevIds =>
                    Array.from(new Set([...prevIds, ...data]))
                );
            }
        } catch (err) {
            console.error("Batch favori hatası:", err);
        }
    }, [BASE_URL]);

    // fetchProducts'u useCallback ile sarla
    const fetchProducts = useCallback(async (pageNum: number) => {
        if (!BASE_URL) {
            console.error("API URL not configured");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `${BASE_URL}/products?page=${pageNum}&limit=${ITEMS_PER_PAGE}`
            );
            const data: any = await response.json();

            const productList = Array.isArray(data) ? data : (data.products || []);

            if (pageNum === 1) {
                setProducts(productList);
            } else {
                setProducts(prev => [...prev, ...productList]);
            }

            checkFavoritesBatch(productList);
            setHasMore(productList.length === ITEMS_PER_PAGE);
        } catch (err) {
            console.error("Veri çekme hatası:", err);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [BASE_URL, ITEMS_PER_PAGE, checkFavoritesBatch]);

    // İlk yükle - sadece mount'da
    useEffect(() => {
        fetchProducts(1);
    }, []);

    // Page değiştiğinde fetch yap
    useEffect(() => {
        if (page > 1) {
            fetchProducts(page);
        }
    }, [page, fetchProducts]);

    // Infinite scroll listener with debounce
    useEffect(() => {
        let lastScrollTime = 0;
        const SCROLL_DEBOUNCE = 500; // 500ms debounce

        const handleScroll = () => {
            const now = Date.now();

            // Debounce - en az 500ms sonra trigger et
            if (now - lastScrollTime < SCROLL_DEBOUNCE) {
                return;
            }

            // Sayfanın sonuna 500px kala yükle
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
                && !isLoading  // Zaten loading değilse
                && hasMore     // Daha ürün varsa
            ) {
                lastScrollTime = now;
                setPage(prevPage => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore]);

    const loadMore = () => {
        if (!isLoading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <div className="w-full max-w-[1500px] mx-auto min-h-screen">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 p-2 md:p-10">
                {products.map((product: any, index: number) => (
                    <ProductCard
                        key={product.id}
                        {...product}
                        index={index}
                        isFavorite={favoriteIds.includes(product.id)}
                    />
                ))}
            </div>

            {/* Loading indicator */}
            {isLoading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            )}

            {/* Manual load more button */}
            {hasMore && !isLoading && (
                <div className="flex justify-center py-8">
                    <button
                        onClick={loadMore}
                        className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                        Daha Fazla Yükle
                    </button>
                </div>
            )}

            {/* No products message */}
            {!isLoading && products.length === 0 && (
                <div className="flex justify-center py-20 text-gray-400">
                    <p className="text-sm">Ürün bulunamadı</p>
                </div>
            )}
        </div>
    );
}