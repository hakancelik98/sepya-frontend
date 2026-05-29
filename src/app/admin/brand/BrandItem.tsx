"use client";
import { Type, FileText, LinkIcon, ImageIcon, Save, RefreshCw, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface BrandItemProps {
    item: any;
    index: number;
    onUpdate: (id: number | undefined, index: number) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onToggleStatus: (id: number) => Promise<void>;
    onChange: (index: number, field: string, value: string) => void;
    onImageChange: (index: number, file: File) => void;
    onRemoveImage: (index: number) => void;
    loading: boolean;
    isDragging?: boolean;
    onDragStart?: (index: number) => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (targetIndex: number) => void;

}

export default function BrandItem({
                                      item,
                                      index,
                                      onUpdate,
                                      onDelete,
                                      onToggleStatus,
                                      onChange,
                                      onImageChange,
                                      onRemoveImage,
                                      loading,
                                      isDragging,
                                      onDragStart,
                                      onDragOver,
                                      onDrop
                                  }: BrandItemProps) {

    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    const fixUrl = (path: string) => {
        if (!path) return "/placeholder.jpg";
        return path.startsWith("http") ? path : `${ASSET_BASE}${path}`;
    };

    const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageChange(index, e.target.files[0]);
        }
    };

    return (
        <div
            className={`space-y-3 bg-gray-50 p-4 rounded-sm border-2 transition-all ${
                isDragging ? 'border-black bg-blue-50 opacity-50' : 'border-gray-100'
            } cursor-grab active:cursor-grabbing`}
            draggable
            onDragStart={() => onDragStart?.(index)}
            onDragOver={onDragOver}
            onDrop={() => onDrop?.(index)}
        >
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    <Type size={12} /> Marka Bilgileri
                </label>
                {item.id && (
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => onToggleStatus(item.id)}
                            className={`p-1.5 transition-all ${
                                item.active
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }`}
                            title={item.active ? "Pasif Yap" : "Aktif Yap"}
                        >
                            {item.active ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                            title="Sil"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                )}
            </div>

            <input
                type="text"
                placeholder="Marka İsmi (Örn: pierre cardin)"
                className="w-full bg-white border border-gray-200 p-2 text-xs font-bold outline-none focus:border-black transition-all"
                value={item.name || ""}
                onChange={(e) => onChange(index, 'name', e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
                <input
                    type="text"
                    placeholder="Slug (link adı. örn: sepya.com/pierrecardin)"
                    className="w-full bg-white border border-gray-200 p-2 text-xs font-bold outline-none focus:border-black"
                    value={item.slug || ""}
                    onChange={(e) => onChange(index, 'slug', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Açıklama"
                    className="w-full bg-white border border-gray-200 p-2 text-xs font-bold outline-none focus:border-black"
                    value={item.description || ""}
                    onChange={(e) => onChange(index, 'description', e.target.value)}
                />
            </div>

            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    {(item.imagePreviewUrl || item.imageUrl) && (
                        <div className="relative">
                            <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-white">
                                <Image
                                    src={item.imagePreviewUrl || fixUrl(item.imageUrl)}
                                    alt={item.name || "Preview"}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                />
                            </div>
                            <button
                                onClick={() => onRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-all shadow-md"
                                title="Görseli Kaldır"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <input
                        type="file"
                        className="block w-full text-[10px] text-gray-500 file:mr-3 file:py-2 file:px-4 file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
                        onChange={handleImageInput}
                    />
                </div>
            </div>

            <button
                onClick={() => onUpdate(item.id, index)}
                disabled={loading}
                className="w-full bg-black text-white py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-xl disabled:bg-gray-400"
            >
                <Save size={14} /> {loading ? "KAYDEDİLİYOR..." : "KAYDET"}
            </button>
        </div>
    );
}