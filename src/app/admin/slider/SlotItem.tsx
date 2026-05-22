"use client";
import { Plus, X } from "lucide-react";

interface SlotItemProps {
    index: number;
    product: any;
    onOpenModal: (index: number) => void;
    onRemove: (index: number) => void;
}

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

export default function SlotItem({ index, product, onOpenModal, onRemove }: SlotItemProps) {
    const fixUrl = (path: string) => {
        if (!path) return "";
        return path.startsWith("http")
            ? path
            : `${ASSET_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
    };

    return (
        <div className="relative group">
            {/* Sıra Numarası */}
            <div className="absolute -top-3 -left-3 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-black z-10 shadow-lg border-2 border-white italic">
                {index + 1}
            </div>

            <div
                onClick={() => !product && onOpenModal(index)}
                className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all duration-500 overflow-hidden flex flex-col items-center justify-center cursor-pointer
                    ${product
                    ? "border-black bg-white shadow-xl scale-[0.98] group-hover:scale-100"
                    : "border-gray-200 bg-gray-50 hover:border-black hover:bg-white"}`}
            >
                {product ? (
                    <>
                        <img
                            src={fixUrl(product.imageUrl)}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                                className="bg-white p-3 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90"
                            >
                                <X size={18} strokeWidth={3} />
                            </button>
                        </div>
                        {/* Bilgi Bandı */}
                        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                            <p className="text-[9px] text-white font-black truncate uppercase tracking-widest italic">{product.title}</p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-300 group-hover:text-black transition-colors">
                        <Plus size={30} strokeWidth={1.5} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Boş Slot</span>
                    </div>
                )}
            </div>
        </div>
    );
}