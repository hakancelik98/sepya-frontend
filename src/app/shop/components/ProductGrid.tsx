"use client";
import ProductCard from "@/components/ProductCard";
import { PackageSearch } from "lucide-react";

export default function ProductGrid({ products }: { products: any[] }) {
    if (!products || products.length === 0) {
        return (
            <div className="w-full py-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                <PackageSearch size={32} className="text-slate-200 mb-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ürün Bulunamadı</h3>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => (
                p && <ProductCard key={p.id} {...p} />
            ))}
        </div>
    );
}