"use client";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Category = { id: number; name: string; slug: string };

export default function FilterSidebar({
                                          isOpen,
                                          categories,
                                          brands,
                                          selectedBrand,
                                          setSelectedBrand,
                                          priceRange,
                                          setPriceRange,
                                          sortBy,
                                          setSortBy,
                                          activeCategory
                                      }: any) {
    const router = useRouter();
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
    const [subcategories, setSubcategories] = useState<Record<number, Category[]>>({});

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    // Slug'ı okunabilir formata çevir
    const formatBrandName = (slug: string) => {
        if (slug === "tümü") return "Tümü";
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Alt kategorileri yükle
    const loadSubcategories = async (categoryId: number) => {
        if (subcategories[categoryId]) return; // Zaten yüklendiyse tekrar yükleme

        try {
            const res = await fetch(
                `${BASE_URL}/categories/${categoryId}/subcategories`
            );
            const data = await res.json();
            setSubcategories(prev => ({ ...prev, [categoryId]: data }));
        } catch (error) {
            console.error("Alt kategori yükleme hatası:", error);
        }
    };

    // Kategori genişletme/daraltma
    const toggleCategory = (categoryId: number) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryId);
            loadSubcategories(categoryId);
        }
    };

    const handleCategoryClick = (slug: string | null) => {
        if (slug) {
            router.push(`/shop?category=${slug}`, { scroll: false });
        } else {
            router.push("/shop", { scroll: false });
        }
    };

    const handleClearFilters = () => {
        setSelectedBrand("tümü");
        setPriceRange(20000);
        setSortBy("Varsayılan");
        // Kategori filtresini koruyoruz, sadece diğer filtreleri temizliyoruz
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden bg-white border-b border-slate-200"
                >
                    <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-12">

                        {/* Kategori */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">
                                Koleksiyonlar
                            </h3>
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => handleCategoryClick(null)}
                                    className={`text-left text-xs transition-all py-1 ${
                                        !activeCategory
                                            ? 'font-black underline underline-offset-4'
                                            : 'text-slate-500 hover:text-black hover:ml-1'
                                    }`}
                                >
                                    Tümü
                                </button>
                                {categories.map((cat: any) => {
                                    const isExpanded = expandedCategory === cat.id;
                                    const isActive = activeCategory === cat.slug;
                                    const subs = subcategories[cat.id] || [];

                                    return (
                                        <div key={cat.id} className="flex flex-col">
                                            {/* Ana Kategori */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleCategoryClick(cat.slug)}
                                                    className={`flex-1 text-left text-xs transition-all py-1 ${
                                                        isActive
                                                            ? 'font-black text-black ml-2 underline underline-offset-4'
                                                            : 'text-slate-500 hover:text-black hover:ml-1'
                                                    }`}
                                                >
                                                    {cat.name}
                                                </button>
                                                {/* Toggle Butonu */}
                                                <button
                                                    onClick={() => toggleCategory(cat.id)}
                                                    className="p-1 hover:bg-slate-100 rounded transition"
                                                >
                                                    <ChevronDown
                                                        size={12}
                                                        className={`text-slate-400 transition-transform ${
                                                            isExpanded ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Alt Kategoriler */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden ml-4 mt-1"
                                                    >
                                                        <div className="flex flex-col gap-1 border-l border-slate-200 pl-3">
                                                            {subs.length === 0 ? (
                                                                <span className="text-[10px] text-slate-400 italic py-1">
                                                                    Alt kategori yok
                                                                </span>
                                                            ) : (
                                                                subs.map((sub: Category) => (
                                                                    <button
                                                                        key={sub.id}
                                                                        onClick={() => handleCategoryClick(sub.slug)}
                                                                        className={`text-left text-[11px] transition-all py-1 ${
                                                                            activeCategory === sub.slug
                                                                                ? 'font-bold text-black underline underline-offset-2'
                                                                                : 'text-slate-400 hover:text-black hover:ml-1'
                                                                        }`}
                                                                    >
                                                                        {sub.name}
                                                                    </button>
                                                                ))
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* MARKA BÖLÜMÜ */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">
                                Markalar
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {brands.map((brand: string) => (
                                    <button
                                        key={brand}
                                        onClick={() => setSelectedBrand(brand)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                                            selectedBrand === brand
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white border-slate-200 hover:border-slate-400'
                                        }`}
                                    >
                                        {formatBrandName(brand)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fiyat */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Fiyat Aralığı
                                </h3>
                                <span className="text-[10px] font-mono font-bold text-black">
                                    {priceRange.toLocaleString()}₺
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="20000"
                                step="500"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                            <div className="flex justify-between text-[9px] text-slate-400">
                                <span>0₺</span>
                                <span>20.000₺</span>
                            </div>
                        </div>

                        {/* Sıralama */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">
                                Sıralama
                            </h3>
                            <div className="flex flex-col gap-2">
                                {["Varsayılan", "Fiyat: Artan", "Fiyat: Azalan"].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSortBy(s)}
                                        className={`text-left text-xs transition-all ${
                                            sortBy === s
                                                ? 'font-black underline underline-offset-4'
                                                : 'text-slate-500 hover:text-black hover:ml-1'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-2 text-[9px] font-black uppercase text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all mt-4 w-fit"
                            >
                                <RotateCcw size={12} /> Filtreleri Temizle
                            </button>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}