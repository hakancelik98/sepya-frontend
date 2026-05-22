"use client";
import { Truck, RefreshCw, ShieldCheck, ChevronRight, Ruler, Info } from "lucide-react";
import ProductActions from "./ProductActions";
import Link from "next/link";

export default function ProductInfo({ product }: { product: any }) {
    const otherVariants = product.variants?.filter((v: any) => String(v.id) !== String(product.id)) || [];

    const fixUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;

        const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;

        return `${baseUrl}${cleanPath}`;
    };

    return (
        <div className="space-y-6 w-full text-zinc-900 bg-white p-2 md:p-4 lg:max-w-[550px]">

            {/* 1. ÜST SEGMENT: Marka, REF ve Başlık */}
            <div className="space-y-3">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <span className="text-zinc-900">{product.brand}</span>
                        <ChevronRight size={10} strokeWidth={3} className="text-zinc-300" />
                        <span>{product.category?.name}</span>
                    </div>
                    {/* REF ALANI: Sağ üstte, hafif ve profesyonel bir görünüm */}
                    <span className="text-[10px] font-medium text-zinc-400 tracking-tighter">
                        REF: <span className="text-zinc-600">{product.sku || "N/A"}</span>
                    </span>
                </nav>

                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 leading-[1.1]">
                    {product.title}
                </h1>

                <div className="flex items-center gap-3 pt-1">
                    <span className="text-2xl font-black tracking-tighter text-red-600">
                        {Number(product.discountedPrice || product.price).toLocaleString("tr-TR")} ₺
                    </span>
                    {product.discountedPrice > 0 && (
                        <span className="text-xl text-zinc-400 line-through decoration-zinc-300">
                            {Number(product.price).toLocaleString("tr-TR")} ₺
                        </span>
                    )}
                </div>
            </div>

            {/* 2. TEKNİK ÖZELLİKLER: Modern Chip Tasarımı */}
            <div className="flex flex-wrap gap-2 py-4 border-y border-zinc-50">
                <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-lg transition-hover hover:bg-zinc-100">
                    <Info size={14} className="text-zinc-400" />
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-zinc-400 leading-none mb-0.5">Materyal</span>
                        <span className="text-[11px] font-bold text-zinc-700 leading-none">{product.material || "Saf İpek"}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-lg transition-hover hover:bg-zinc-100">
                    <Ruler size={14} className="text-zinc-400" />
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-zinc-400 leading-none mb-0.5">Ölçü</span>
                        <span className="text-[11px] font-bold text-zinc-700 leading-none">{product.size || "90x90 CM"}</span>
                    </div>
                </div>
            </div>

            {/* 3. AÇIKLAMA */}
            <div className="max-w-[480px]">
                <p className="text-[14px] text-zinc-500 leading-relaxed italic border-l-2 border-zinc-100 pl-4">
                    {product.description}
                </p>
            </div>

            {/* 4. VARYANTLAR */}
            {otherVariants.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Renkler</span>
                        <div className="h-[1px] flex-1 bg-zinc-50" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {otherVariants.map((v: any) => (
                            <Link
                                key={v.id}
                                href={`/product/${v.id}`}
                                className="group w-12 h-14 rounded-lg overflow-hidden border border-zinc-100 hover:border-black transition-all shadow-sm"
                            >
                                <img src={fixUrl(v.imageUrl)} alt={v.color} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 5. SEPET AKSİYONU */}
            <div className="pt-2">
                <ProductActions product={product} />
            </div>

            {/* 6. GÜVENLİK İKONLARI */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 rounded-2xl text-white shadow-lg">
                <div className="flex flex-col items-center gap-1">
                    <Truck size={14} strokeWidth={2.5} />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Hızlı Kargo</span>
                </div>
                <div className="w-[1px] h-6 bg-zinc-700" />
                <div className="flex flex-col items-center gap-1">
                    <RefreshCw size={13} strokeWidth={2.5} />
                    <span className="text-[8px] font-black uppercase tracking-tighter">14 Gün İade</span>
                </div>
                <div className="w-[1px] h-6 bg-zinc-700" />
                <div className="flex flex-col items-center gap-1">
                    <ShieldCheck size={14} strokeWidth={2.5} />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Orijinal</span>
                </div>
            </div>
        </div>
    );
}