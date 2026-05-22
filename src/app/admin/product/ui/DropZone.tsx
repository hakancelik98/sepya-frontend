"use client";

import { ImagePlus } from "lucide-react";

export default function DropZone({ onFilesSelected }: any) {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            onFilesSelected(filesArray);
        }
    };

    return (
        <label className="relative aspect-[3/4] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-white hover:border-black transition-all flex flex-col items-center justify-center cursor-pointer group">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm group-hover:shadow-xl group-hover:scale-110 flex items-center justify-center transition-all duration-500">
                <ImagePlus className="text-slate-400 group-hover:text-black" size={32} />
            </div>

            <div className="mt-4 text-center px-4">
                <p className="text-[10px] font-black text-slate-400 group-hover:text-black tracking-[0.2em] uppercase">
                    Görsel Ekle
                </p>
                <p className="text-[8px] text-slate-300 font-bold uppercase mt-1">
                    Sürükle veya Seç
                </p>
            </div>

            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </label>
    );
}