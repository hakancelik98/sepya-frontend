"use client";

import { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import ProductFormWithVariants from "./components/ProductFormWithVariants";
import ProductList from "./components/ProductList";
import { Loader2, Plus, Package } from "lucide-react";

export default function ProductModule() {
    const product = useProducts();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const openCreateDrawer = () => {
        setEditingProduct(null);
        setIsDrawerOpen(true);
    };

    const openEditDrawer = (p: any) => {
        setEditingProduct(p);
        setIsDrawerOpen(true);
    };

    const handleSave = async (dtoData: any, allFiles: File[]) => {
        const success = await product.handleSubmit(dtoData, allFiles);
        if (success) {
            setIsDrawerOpen(false);
            setEditingProduct(null);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#fcfcfd] overflow-hidden font-sans antialiased text-slate-900">
            {product.loading && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            )}

            {/* ANA İÇERİK ALANI */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* İnce Üst Header */}
                <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-2">
                        <Package size={20} className="text-blue-600" />
                        <h1 className="font-semibold text-sm tracking-tight text-slate-700">Ürün Portföyü</h1>
                        <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {product.allProducts.length} Ürün
                        </span>
                    </div>
                    <button
                        onClick={openCreateDrawer}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={16} /> Yeni Ürün + Varyantlar
                    </button>
                </header>

                {/* Liste Alanı */}
                <div className="flex-1 overflow-hidden">
                    <ProductList
                        filteredProducts={product.filteredProducts}
                        handleEdit={openEditDrawer}
                        handleDelete={product.handleDelete}
                        handleDuplicate={product.handleDuplicate}
                        setSearchTerm={product.setSearchTerm}
                    />
                </div>
            </main>

            {/* SAĞDAN AÇILAN DRAWER - Modal wrapper YOK */}
            {isDrawerOpen && (
                <ProductFormWithVariants
                    categories={product.categories}
                    brands={product.brands}
                    editingProduct={editingProduct}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setEditingProduct(null);
                    }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}