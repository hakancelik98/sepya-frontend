"use client";
import { X, Search, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProductSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (product: any) => void;
    allProducts: any[];
}

export default function ProductSelectorModal({ isOpen, onClose, onSelect, allProducts }: ProductSelectorModalProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    if (!isOpen) return null;

    const fixUrl = (path: string) => {
        if (!path) return "";
        return path.startsWith("http")
            ? path
            : `${ASSET_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
    };

    const filteredProducts = allProducts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">

                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-black uppercase tracking-tighter text-2xl italic leading-none">Ürün Seçiniz</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Slider vitrini için ürün atayın</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="p-8 pb-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text" placeholder="Koleksiyonlarda ara..."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl py-4 pl-12 pr-6 text-sm transition-all outline-none font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-2 space-y-3 custom-scrollbar">
                    {filteredProducts.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => onSelect(p)}
                            className="flex items-center gap-4 p-3 border border-gray-50 rounded-2xl hover:border-black hover:bg-gray-50 cursor-pointer group transition-all"
                        >
                            <div className="w-16 h-20 relative rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                <img
                                    src={fixUrl(p.imageUrl)}
                                    alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] font-black uppercase tracking-tight text-gray-400 group-hover:text-black transition-colors">{p.brand}</p>
                                <p className="text-sm font-bold uppercase">{p.title}</p>
                                <p className="text-[11px] text-gray-500 mt-1 font-black">{p.price} ₺</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}