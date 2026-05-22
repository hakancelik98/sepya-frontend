"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const subcategoryMenuVariants: Variants = {
    hidden: { x: "-20%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { x: "-10%", opacity: 0, transition: { duration: 0.2 } },
};

type Category = { id: number; name: string; slug: string };

interface SubcategoryPopupProps {
    type: "brands" | "category";
    category: Category | null;
    onClose: () => void;
    onBack: () => void;
}

export default function SubcategoryPopup({
                                             type,
                                             category,
                                             onClose,
                                             onBack,
                                         }: SubcategoryPopupProps) {
    const router = useRouter();
    const [brands, setBrands] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        setLoading(true);
        if (type === "brands") {
            fetch(`${BASE_URL}/brands`)
                .then(res => res.json())
                .then(data => {
                    setBrands(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else if (type === "category" && category) {
            fetch(`${BASE_URL}/categories/${category.id}/subcategories`)
                .then(res => res.json())
                .then(data => {
                    setSubcategories(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [type, category]);

    const handleBrandClick = (brandSlug: string) => {
        onClose();
        router.push(`/shop?brand=${brandSlug}`);
    };

    const handleSubcategoryClick = (subcategorySlug: string) => {
        onClose();
        router.push(`/shop?category=${subcategorySlug}`);
    };

    const handleViewAllCategory = () => {
        if (category) {
            onClose();
            router.push(`/shop?category=${category.slug}`);
        }
    };

    const title = type === "brands" ? "Markalar" : category?.name || "";

    return (
        <motion.div
            variants={subcategoryMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-[100dvh] w-[280px] md:w-85 bg-white border-l border-zinc-50 flex flex-col pointer-events-auto shadow-2xl"
        >
            <div className="flex flex-col p-8 md:p-10 h-full">

                {/* GERİ BUTONU - Daha Minimalist */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 mb-10 text-zinc-400 hover:text-black transition-all group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                        Geri
                    </span>
                </button>

                {/* BAŞLIK - Zinc rengi ve ince font */}
                <div className="mb-8">
                    <h3 className="text-[13px] font-light uppercase tracking-[0.25em] text-zinc-400 border-b border-zinc-50 pb-4">
                        {title}
                    </h3>
                </div>

                {/* İÇERİK LİSTESİ */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                    {loading ? (
                        /* Skeleton Loading */
                        [1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-12 w-full bg-zinc-50/50 animate-pulse border-b border-zinc-50/30" />
                        ))
                    ) : type === "brands" ? (
                        brands.map(brand => (
                            <button
                                key={brand.id}
                                onClick={() => handleBrandClick(brand.slug)}
                                className="group flex items-center justify-between w-full py-4 border-b border-zinc-50 transition-all text-left"
                            >
                                <span className="text-[11px] tracking-[0.15em] uppercase text-zinc-500 group-hover:text-black group-hover:pl-2 transition-all">
                                    {brand.name}
                                </span>
                                <ChevronRight size={12} className="text-zinc-200 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                        ))
                    ) : (
                        subcategories.map((subcategory) => (
                            <button
                                key={subcategory.id}
                                onClick={() => handleSubcategoryClick(subcategory.slug)}
                                className="group flex items-center justify-between w-full py-4 border-b border-zinc-50 transition-all text-left"
                            >
                                <span className="text-[11px] tracking-[0.15em] uppercase text-zinc-500 group-hover:text-black group-hover:pl-2 transition-all">
                                    {subcategory.name}
                                </span>
                                <ChevronRight size={12} className="text-zinc-200 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                        ))
                    )}
                </div>

                {/* TÜM ÜRÜNLERİ GÖR - Sticky Bottom Alt Çizgi Tasarımı */}
                {type === "category" && category && !loading && (
                    <div className="mt-auto pt-8">
                        <button
                            onClick={handleViewAllCategory}
                            className="group relative flex items-center justify-center w-full py-4 border border-zinc-900 bg-white hover:bg-black transition-all duration-300"
                        >
                            <span className="text-black group-hover:text-white font-bold uppercase tracking-[0.2em] text-[9px]">
                                Tüm Koleksiyonu Gör
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}