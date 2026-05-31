"use client";
import {useState, useEffect, useRef} from "react";
import Image from "next/image";
import Link from "next/link";
import {motion, AnimatePresence} from "framer-motion";
import {Info, Mail, Search, Loader2, ChevronRight} from "lucide-react";
import SubcategoryPopup from "./SubcategoryPopup";
import { useRouter } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";

type Product = { id: number; title: string; imageUrl: string; brand: string; sku?: string; };
type Category = { id: number; name: string; slug: string };

export default function HeaderPopup({onClose}: { onClose: () => void }) {
    const router = useRouter();
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [subcategoryOpen, setSubcategoryOpen] = useState(false);
    const [subcategoryType, setSubcategoryType] = useState<"brands" | "category">("category");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    useEffect(() => {
        setIsOpen(true);
        fetch(`${API_BASE}/categories/main`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Kategori hatası:", err));

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                fetch(`${API_BASE}/products`)
                    .then(res => res.json())
                    .then((data: Product[]) => {
                        const filtered = data.filter(p =>
                            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        setSearchResults(filtered.slice(0, 5));
                        setIsSearching(false);
                    }).catch(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim().length > 0) {
            handleClose();
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleClose = async () => {
        if (subcategoryOpen) {
            setSubcategoryOpen(false);
            await new Promise(r => setTimeout(r, 200));
        }
        setIsOpen(false);
        setTimeout(() => onClose(), 300);
    };

    const handleCategoryClick = (category: Category) => {
        setSubcategoryType("category");
        setSelectedCategory(category);
        setSubcategoryOpen(true);
    };

    const handleBrandsToggle = () => {
        setSubcategoryType("brands");
        setSelectedCategory(null);
        setSubcategoryOpen(true);
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex overflow-hidden h-[100dvh] w-screen touch-none">
                    {/* Overlay */}
                    <motion.div
                        initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto cursor-pointer"
                        onClick={handleClose}
                    />

                    <div className="relative flex h-full pointer-events-none items-start max-w-full">
                        {/* ANA PANEL KAYMA MANTIĞI */}
                        <motion.div
                            initial={{x: "-100%"}}
                            animate={{x: 0}}
                            exit={{x: "-100%"}}
                            transition={{type: "tween", duration: 0.3}}
                            className={`relative z-50 h-full w-[280px] md:w-85 bg-white shadow-2xl flex flex-col pointer-events-auto 
                                overflow-x-hidden overflow-y-auto no-scrollbar max-w-[calc(100vw-40px)] transition-opacity duration-300 ${
                                subcategoryOpen ? "opacity-40 md:opacity-100" : "opacity-100"
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col p-8 md:p-10 w-full min-h-full overflow-x-hidden">

                                {/* 1. ARAMA */}
                                <div className="relative mb-12 shrink-0" ref={searchRef}>
                                    <div className="relative flex items-center h-10 border-b border-zinc-100 focus-within:border-black transition-all">
                                        <Search className="absolute left-0 text-zinc-400" size={14}/>
                                        <input
                                            type="text"
                                            placeholder="KOLEKSİYONDA ARA..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={handleSearchSubmit}
                                            /*
                                              Aşağıdaki sınıflarda font boyutu tarayıcı zoom yapmasın diye text-base (16px) yapıldı.
                                              Visual (görsel) olarak eski 10px boyutuna sadık kalmak için origin-left ile sola yaslanıp
                                              scale-[0.625] (%62.5) oranında küçültüldü. Genişlik ise küçülmeden kaynaklı kısalmasın diye %160 yapıldı.
                                            */
                                            className="w-[160%] pl-11 bg-transparent border-none outline-none text-base tracking-[0.3em] uppercase text-zinc-900 transform origin-left scale-[0.625]"
                                        />
                                        {isSearching && <Loader2 className="absolute right-0 animate-spin text-zinc-400" size={12}/>}
                                    </div>

                                    {/* Arama Sonuçları Paneli (Burası aynı kalıyor) */}
                                    <AnimatePresence>
                                        {searchResults.length > 0 && (
                                            <motion.div
                                                initial={{opacity: 0, y: -5}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -5}}
                                                className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl border border-zinc-50 z-[70]"
                                            >
                                                {searchResults.map((product) => (
                                                    <Link key={product.id} href={`/product/${product.id}`} onClick={handleClose}
                                                          className="flex items-center gap-3 p-3 hover:bg-zinc-50 border-b border-zinc-50 last:border-none">
                                                        <div className="w-8 h-10 relative shrink-0 bg-zinc-50">
                                                            <Image
                                                                src={
                                                                    product.imageUrl
                                                                        ? (product.imageUrl.startsWith("http")
                                                                            ? product.imageUrl
                                                                            : `${ASSET_BASE}${product.imageUrl}`)
                                                                        : "/placeholder.jpg"
                                                                }
                                                                alt="" fill className="object-cover"/>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-bold uppercase truncate text-zinc-800 tracking-tight">{product.title}</p>
                                                            <p className="text-[9px] text-zinc-400 uppercase tracking-widest">{product.brand}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 2. LOGO */}
                                <div className="flex justify-center mb-12 shrink-0">
                                    <Link href="/" onClick={handleClose}>
                                        <Image
                                            src={settings?.logoUrl
                                                ? (settings.logoUrl.startsWith("http")
                                                    ? settings.logoUrl
                                                    : `${ASSET_BASE}${settings.logoUrl}`)
                                                : "/logo.jpg"
                                            }
                                            alt={settings?.siteName || "Logo"}
                                            width={110}
                                            height={55}
                                            className="object-contain"
                                            priority
                                        />
                                    </Link>
                                </div>

                                {/* 3. NAVİGASYON (MARKALAR DAHİL) */}
                                <nav className="flex-1 flex flex-col min-h-0 overflow-x-hidden">
                                    <button
                                        onClick={handleBrandsToggle}
                                        className="group flex items-center justify-between w-full py-4 border-b border-zinc-50 transition-all duration-300"
                                    >
                                        <span className={`uppercase tracking-[0.25em] text-[11px] transition-all ${
                                            subcategoryOpen && subcategoryType === "brands" ? "font-bold pl-2" : "text-zinc-500 group-hover:text-black group-hover:pl-2"
                                        }`}>Markalar</span>
                                        <ChevronRight size={14} className={`text-zinc-300 transition-transform ${subcategoryOpen && subcategoryType === "brands" ? 'rotate-90 text-black' : ''}`} />
                                    </button>

                                    <div className="flex flex-col overflow-x-hidden">
                                        {categories.map((cat) => {
                                            const isSelected = selectedCategory?.id === cat.id && subcategoryOpen && subcategoryType === "category";
                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => handleCategoryClick(cat)}
                                                    className="group flex items-center justify-between w-full py-4 border-b border-zinc-50 transition-all duration-300"
                                                >
                                                    <span className={`uppercase tracking-[0.25em] text-[11px] transition-all truncate ${
                                                        isSelected ? "font-bold pl-2 text-black" : "text-zinc-500 group-hover:text-black group-hover:pl-2"
                                                    }`}>{cat.name}</span>
                                                    <ChevronRight size={14} className={`text-zinc-300 transition-transform ${isSelected ? 'rotate-90 text-black' : ''}`} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </nav>

                                {/* 4. ALT MENÜ */}
                                <div className="mt-auto pt-8 flex flex-col space-y-4 shrink-0 border-t border-zinc-50">
                                    <Link href="/about" onClick={handleClose} className="flex items-center gap-3 text-zinc-400 hover:text-black transition-colors">
                                        <Info size={14}/>
                                        <span className="uppercase tracking-[0.2em] text-[9px]">Hakkımızda</span>
                                    </Link>
                                    <Link href="/contact" onClick={handleClose} className="flex items-center gap-3 text-zinc-400 hover:text-black transition-colors">
                                        <Mail size={14}/>
                                        <span className="uppercase tracking-[0.2em] text-[9px]">İletişim</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* SUBCATEGORY POPUP */}
                        <AnimatePresence>
                            {subcategoryOpen && (
                                <div className="h-full pointer-events-auto absolute left-0 md:relative z-[60] md:z-40">
                                    <SubcategoryPopup
                                        type={subcategoryType}
                                        category={selectedCategory}
                                        onClose={handleClose}
                                        onBack={() => setSubcategoryOpen(false)}
                                    />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}