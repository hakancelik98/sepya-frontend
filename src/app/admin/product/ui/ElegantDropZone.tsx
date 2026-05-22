"use client";

import { ImagePlus, Trash2 } from "lucide-react";

export default function ElegantDropZone({ label, image, onSelect, onClear, existingUrl }: any) {
    return (
        <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden border-2 border-slate-100 bg-slate-50 group transition-all">
            {/* Önizleme veya Mevcut Görsel Varsa */}
            {(image || existingUrl) ? (
                <>
                    <img
                        src={image ? URL.createObjectURL(image) : existingUrl}
                        alt={label}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                        <label className="w-full max-w-[160px] bg-white text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-all text-center shadow-xl">
                            Dosyayı Değiştir
                            <input
                                type="file"
                                className="hidden"
                                onChange={e => onSelect(e.target.files?.[0] || null)}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={onClear}
                            className="text-white/60 hover:text-red-400 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
                        >
                            <Trash2 size={14} /> Kaldır
                        </button>
                    </div>
                </>
            ) : (
                /* Görsel Yoksa Boş Durum */
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/label">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm group-hover/label:shadow-xl group-hover/label:scale-110 flex items-center justify-center transition-all duration-500">
                        <ImagePlus className="text-slate-400 group-hover/label:text-black" size={24} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 group-hover/label:text-black mt-4 tracking-[0.2em] uppercase">
                        {label} Seç
                    </span>
                    <input
                        type="file"
                        className="hidden"
                        onChange={e => onSelect(e.target.files?.[0] || null)}
                    />
                </label>
            )}
        </div>
    );
}