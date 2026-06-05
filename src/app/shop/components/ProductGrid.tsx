"use client";
import ProductCard from "@/components/ProductCard";
import { PackageSearch } from "lucide-react";

function SkeletonCard({ delay = 0 }: { delay?: number }) {
    return (
        <div className="flex flex-col gap-2.5" style={{ animationDelay: `${delay}ms` }}>
            <div className="w-full bg-slate-100 animate-shimmer" style={{ aspectRatio: "3 / 4" }} />
            <div className="h-[11px] w-4/5 rounded bg-slate-100 animate-shimmer" />
            <div className="h-[11px] w-1/2 rounded bg-slate-100 animate-shimmer" />
            <div className="h-[11px] w-2/3 rounded bg-slate-100 animate-shimmer" />
        </div>
    );
}

export function ProductGridSkeleton() {
    return (
        <div className="px-2 md:px-0">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[6px] md:gap-x-6 md:gap-y-12">
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} delay={i * 50} />
                ))}
            </div>
        </div>
    );
}

export default function ProductGrid({
                                        products,
                                        isLoading = false,
                                        onLoadMore,
                                    }: {
    products: any[];
    isLoading?: boolean;
    onLoadMore?: () => void;
}) {
    if (isLoading && products.length === 0) {
        return <ProductGridSkeleton />;
    }

    if (!products || products.length === 0) {
        return (
            <div className="w-full py-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                <PackageSearch size={32} className="text-slate-200 mb-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Ürün Bulunamadı
                </h3>
            </div>
        );
    }

    return (
        <>
            {/* Mobilde px-2 → kenarlarda boşluk, masaüstünde px-0 (ShopModule zaten px-6 veriyor) */}
            {/* Mobilde gap-[2px] → slider ile aynı his, masaüstünde normal gap */}
            <div className="px-2 md:px-0">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[6px] md:gap-x-6 md:gap-y-12">
                    {products.map((p, index) =>
                            p && (
                                <ProductCard
                                    key={p.id}
                                    {...p}
                                    index={index}
                                />
                            )
                    )}

                    {isLoading &&
                        Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonCard key={`sk-${i}`} delay={i * 50} />
                        ))}
                </div>
            </div>

            {onLoadMore && <div className="w-full h-10 mt-12" id="load-more-trigger" />}
        </>
    );
}