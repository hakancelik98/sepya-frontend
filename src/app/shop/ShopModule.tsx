"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import { SlidersHorizontal, X } from "lucide-react";

export default function ShopModule() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // 1. URL'deki Parametreleri Oku
    const categoryQuery = searchParams.get("category");
    const brandQuery = searchParams.get("brand") || "tümü";
    const priceQuery = Number(searchParams.get("price")) || 20000;
    const sortQuery = searchParams.get("sort") || "Varsayılan";
    const searchQuery = searchParams.get("search") || "";
    const campaignQuery = searchParams.get("campaign") || null; // Kampanya parametresi

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Fiyat için local state (kasma önleme)
    const [localPrice, setLocalPrice] = useState(priceQuery);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    // URL'deki fiyat değiştiğinde local state'i güncelle
    useEffect(() => {
        setLocalPrice(priceQuery);
    }, [priceQuery]);

    // Verileri API'den Çek
    useEffect(() => {
        const fetchData = async () => {
            try {
                let productsUrl = `${API_BASE}/products`;

                // Kampanyalı ürünler
                if (campaignQuery === "featured") {
                    productsUrl = `${API_BASE}/products/featured`;
                }
                // Kategori bazında
                else if (categoryQuery) {
                    productsUrl = `${API_BASE}/products/category/${categoryQuery}`;
                }

                const [prodRes, catRes] = await Promise.all([
                    fetch(productsUrl),
                    fetch(`${API_BASE}/categories/main`)
                ]);
                setProducts(await prodRes.json());
                setCategories(await catRes.json());
            } catch (error) {
                console.error("Veri çekme hatası:", error);
            }
        };
        fetchData();
    }, [campaignQuery, categoryQuery]); // campaignQuery ve categoryQuery'ye göre refetch

    // Ürünlerin içindeki benzersiz markaları ayıkla (slug formatında)
    const brands = useMemo(() => {
        const allBrands = products
            .map((p: any) => p.brand)
            .filter(Boolean)
            .map((brand: string) => brand.toLowerCase().replace(/\s+/g, '-')); // Slug formatına çevir
        return ["tümü", ...Array.from(new Set(allBrands))];
    }, [products]);

    // 2. URL GÜNCELLEME FONKSİYONU - useCallback ile optimize
    const updateURL = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "tümü" || !value || value === "20000" || value === "Varsayılan") {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    // Debounced price update - Fiyat kaydırıcısı için
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localPrice !== priceQuery) {
                updateURL("price", localPrice.toString());
            }
        }, 300); // 300ms bekleme

        return () => clearTimeout(timer);
    }, [localPrice, priceQuery, updateURL]);

    // 3. FİLTRELEME MANTIĞI
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Arama Filtresi - Tüm alanları kontrol et
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

        // Kategori Filtresi - Hem ana hem alt kategorileri kontrol et
        if (categoryQuery) {
            result = result.filter((p: any) => {
                // Ürünün kategorisi veya parent kategorisi eşleşiyorsa göster
                return p.category?.slug === categoryQuery ||
                    p.category?.parentCategory?.slug === categoryQuery;
            });
        }

        // Marka Filtresi (slug karşılaştırması)
        if (brandQuery !== "tümü") {
            result = result.filter((p: any) => {
                const productBrandSlug = p.brand?.toLowerCase().replace(/\s+/g, '-');
                return productBrandSlug === brandQuery;
            });
        }

        // Fiyat Filtresi - URL'deki değeri kullan
        result = result.filter((p: any) => p.price <= priceQuery);

        // Sıralama
        if (sortQuery === "Fiyat: Artan") {
            result.sort((a: any, b: any) => a.price - b.price);
        } else if (sortQuery === "Fiyat: Azalan") {
            result.sort((a: any, b: any) => b.price - a.price);
        }

        return result;
    }, [products, searchQuery, categoryQuery, brandQuery, priceQuery, sortQuery]);

    // Tüm filtreleri sıfırla
    const clearAllFilters = useCallback(() => {
        setLocalPrice(20000);
        const params = new URLSearchParams();
        if (categoryQuery) {
            params.set("category", categoryQuery);
        }
        router.push(pathname + (params.toString() ? `?${params.toString()}` : ""), { scroll: false });
    }, [router, pathname, categoryQuery]);

    const hasActiveFilters = brandQuery !== "tümü" || priceQuery < 20000 || sortQuery !== "Varsayılan" || searchQuery;

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 pt-10">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
                        {campaignQuery === "featured"
                            ? "🎉 KAMPANYALI ÜRÜNLER"
                            : searchQuery
                                ? `ARAMA: "${searchQuery}"`
                                : (categoryQuery ? categoryQuery.replace("-", " ").toUpperCase() : "KOLEKSİYON")}
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

            {/* Filtre Paneli */}
            <FilterSidebar
                isOpen={isFilterOpen}
                categories={categories}
                brands={brands}
                selectedBrand={brandQuery}
                setSelectedBrand={(val: string) => updateURL("brand", val)}
                priceRange={localPrice} // Local state kullan
                setPriceRange={setLocalPrice} // Direkt local state'i güncelle
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
                <ProductGrid products={filteredProducts} />
            </main>
        </div>
    );
}