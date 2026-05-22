"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/types/checkout";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
    isLoading: boolean;
}

export default function CartItem({ item, onUpdateQuantity, onRemove, isLoading }: CartItemProps) {
    const fixUrl = (path: string) => {
        if (!path) return "/placeholder.jpg";
        return path.startsWith("http")
            ? path
            : `${ASSET_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
    };

    const categoryName =
        typeof item.product.category === "object"
            ? item.product.category.name
            : item.product.category;

    const isAtMin = item.quantity <= 1;
    const isAtMax = item.quantity >= item.product.stockQuantity;

    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    return (
        <div className="flex gap-6 p-6 bg-white border border-gray-200 rounded-xl">

            {/* IMAGE */}
            <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img
                    src={fixUrl(item.product.imageUrl)}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* INFO */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-base font-semibold text-black">
                            {item.product.title}
                        </h3>

                        <button
                            onClick={() => onRemove(item.product.id)}
                            disabled={isLoading}
                            className="text-gray-300 hover:text-red-600 transition"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                        {categoryName}
                    </p>

                    {/* STOCK WARNING */}
                    {isAtMax && (
                        <p className="mt-2 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                            ● Stok sınırına ulaşıldı
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-6">
                    {/* QUANTITY */}
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        {/* MINUS */}
                        <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={isAtMin || isLoading}
                            className={`px-3 py-1 transition
                                ${isAtMin
                                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300 text-black"
                            }`}
                        >
                            <Minus size={14} />
                        </button>

                        <span className="px-4 text-sm font-semibold bg-white text-black">
                            {item.quantity}
                        </span>

                        {/* PLUS */}
                        <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={isAtMax || isLoading}
                            className={`px-3 py-1 transition
                                ${isAtMax
                                ? "bg-red-100 text-red-500 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300 text-black"
                            }`}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* PRICE */}
                    <p className="text-lg font-bold text-black">
                        {item.subtotal.toLocaleString("tr-TR")} TL
                    </p>
                </div>
            </div>
        </div>
    );
}
