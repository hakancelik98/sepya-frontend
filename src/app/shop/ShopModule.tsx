"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import { SlidersHorizontal, X } from "lucide-react";

interface SpringPage<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    last: boolean;
}

export default function ShopModule() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const categoryQuery = searchParams.get("category");
    const brandQuery    = searchParams.get("brand") || "tümü";
    const priceQuery    = Number(searchParams.get("price")) || 20000;
    const sortQuery     = searchParams.get("sort") || "Varsayılan";
    const searchQuery   = searchParams.get("search") || "";
    const campaignQuery = searchParams.get("campaign") || null;

    const [products, setProducts]         = useState<any[]>([]);
    const [categories, setCategories]     = useState([]);
    const [page, setPage]                 = useState(0);
    const [totalPages, setTotalPages]     = useState(1);
    const [isLoading, setIsLoading]       = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [resetKey, setResetKey]         = useState(0);

    const [localPrice, setLocalPrice] = useState(priceQuery);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const API_BASE  = process.env.NEXT_PUBLIC_API_URL;
    const PAGE_SIZE = 20;

    useEffect(() => {
        setLocalPrice(priceQuery);
    }, [priceQuery]);

    // Filtre değişince sıfırla + fetch tetikle
    useEffect(() => {
        setProducts([]);
        setTotalPages(1);
        if (page === 0) {
            setResetKey(k => k + 1);
        } else {
            setPage(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignQuery, categoryQuery, brandQuery, priceQuery, sortQuery, searchQuery]);

    // Veri çekme
    useEffect(() => {
        const fetchData = async () => {
            if (isLoading) return;
            setIsLoading(true);

            try {
                const catPromise = categories.length === 0
                    ? fetch(`${API_BASE}/categories/main`).then(r => r.json())
                    : Promise.resolve(null);

                let productsUrl: string;

                if (campaignQuery === "featured") {
                    productsUrl = `${API_BASE}/products/featured`;
                } else if (categoryQuery) {
                    productsUrl = `${API_BASE}/products/category/${categoryQuery}?page=${page}&size=${PAGE_SIZE}`;
                } else {
                    productsUrl = `${API_BASE}/products?page=${page}&size=${PAGE_SIZE}`;
                }

                const [prodRes, catData] = await Promise.all([
                    fetch(productsUrl),
                    catPromise,
                ]);

                const prodData = await prodRes.json();

                if (Array.isArray(prodData)) {
                    setProducts(prodData);
                    setTotalPages(1);
                } else {
                    const springPage: SpringPage<any> = prodData;
                    setProducts(prev =>
                        page === 0 ? springPage.content : [...prev, ...springPage.content]
                    );
                    setTotalPages(springPage.totalPages);
                }

                if (catData) setCategories(catData);

            } catch (error) {
                console.error("Veri çekme hatası:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, resetKey, campaignQuery, categoryQuery]);

    // Infinite scroll
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && page + 1 < totalPages) {
                    setPage(prev => prev + 1);
                }
            },
            { rootMargin: "400px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [isLoading, page, totalPages]);

    const brands = useMemo(() => {
        const allBrands = products
            .map((p: any) => p.brand)
            .filter(Boolean)
            .map((brand: string) => brand.toLowerCase().replace(/\s+/g, '-'));
        return ["tümü", ...Array.from(new Set(allBrands))];
    }, [products]);

    const updateURL = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "tümü" || !value || value === "20000" || value === "Varsayılan") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localPrice !== priceQuery) {
                updateURL("price", localPrice.toString());
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [localPrice, priceQuery, updateURL]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchQuery) {
            result = result.filter((p: any) => {
                const query = searchQuery.toLowerCase();
                return (
                    p.title?.toLowerCase().includes(query) ||
                    p.brand?.toLowerCase().includes(query) ||
                    p.sku?.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query)
                );
            });
        }

        if (categoryQuery) {
            result = result.filter((p: any) =>
                p.category?.slug === categoryQuery ||
                p.category?.parentCategory?.slug === categoryQuery
            );
        }

        if (brandQuery !== "tümü") {
            result = result.filter((p: any) => {
                const productBrandSlug = p.brand?.toLowerCase().replace(/\s+/g, '-');
                return productBrandSlug === brandQuery;
            });
        }

        result = result.filter((p: any) => p.price <= priceQuery);

        if (sortQuery === "Fiyat: Artan") {
            result.sort((a: any, b: any) => a.price - b.price);
        } else if (sortQuery === "Fiyat: Azalan") {
            result.sort((a: any, b: any) => b.price - a.price);
        }

        return result;
    }, [products, searchQuery, categoryQuery, brandQuery, priceQuery, sortQuery]);

    const clearAllFilters = useCallback(() => {
        setLocalPrice(20000);
        const params = new URLSearchParams();
        if (categoryQuery) params.set("category", categoryQuery);
        router.push(pathname + (params.toString() ? `?${params.toString()}` : ""), { scroll: false });
    }, [router, pathname, categoryQuery]);

    const hasActiveFilters =
        brandQuery !== "tümü" || priceQuery < 20000 || sortQuery !== "Varsayılan" || !!searchQuery;

    const hasMore = page + 1 < totalPages;

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-white border-b border-slate-100 px-6 py-4 pt-10">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
                        {campaignQuery === "featured"
                            ? "🎉 KAMPANYALI ÜRÜNLER"
                            : searchQuery
                                ? `ARAMA: "${searchQuery}"`
                                : (categoryQuery
                                    ? categoryQuery.replace("-", " ").toUpperCase()
                                    : "KOLEKSİYON")}
                    </h1>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border px-6 py-2.5 rounded-full transition-all ${
                            isFilterOpen ? 'bg-black text-white' : 'hover:bg-slate-50 text-slate-900'
                        }`}
                    >
                        {isFilterOpen ? <X size={14} /> : <SlidersHorizontal size={14} />}
                        {isFilterOpen ? "Kapat" : "Filtrele"}
                    </button>
                </div>
            </div>

            <FilterSidebar
                isOpen={isFilterOpen}
                categories={categories}
                brands={brands}
                selectedBrand={brandQuery}
                setSelectedBrand={(val: string) => updateURL("brand", val)}
                priceRange={localPrice}
                setPriceRange={setLocalPrice}
                sortBy={sortQuery}
                setSortBy={(val: string) => updateURL("sort", val)}
                activeCategory={categoryQuery}
                searchQuery={searchQuery}
                campaign={campaignQuery}
            />

            <main className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {filteredProducts.length} Ürün Listeleniyor
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="text-[9px] font-bold text-red-500 uppercase underline hover:text-red-600 transition"
                        >
                            Filtreleri Sıfırla
                        </button>
                    )}
                </div>

                <ProductGrid products={filteredProducts} isLoading={isLoading} />

                <div ref={sentinelRef} className="w-full h-1" />

                {isLoading && products.length > 0 && (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {!isLoading && !hasMore && products.length > 0 && (
                    <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-10">
                        Tüm ürünler yüklendi
                    </p>
                )}
            </main>
        </div>
    );
}