"use client";

import { X, Image as ImageIcon, Trash2, Camera, UploadCloud, CheckCircle2, Info } from "lucide-react";
import DropZone from "../ui/DropZone";
import ElegantDropZone from "../ui/ElegantDropZone";

export default function MediaModal({
                                       setShowMediaModal,
                                       mainImage,
                                       setMainImage,
                                       hoverImage,
                                       setHoverImage,
                                       gallery,
                                       setGallery,
                                       existingImages,
                                   }: any) {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 lg:p-12">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                onClick={() => setShowMediaModal(false)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl h-full bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">

                {/* Modal Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
                                <Camera className="text-white" size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">Görsel Laboratuvarı</h2>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 ml-13">Ürün Medya & Galeri Yönetimi</p>
                    </div>
                    <button
                        onClick={() => setShowMediaModal(false)}
                        className="p-4 bg-slate-50 hover:bg-black hover:text-white text-slate-400 rounded-2xl transition-all duration-300 group"
                    >
                        <X size={24} className="group-rotate-90 transition-transform" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">

                    {/* Üst Kısım: Ana ve Hover Görseller */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Ana Görsel Bölümü */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-green-500" /> Ana Kapak Görseli
                                </h4>
                                {existingImages.main && !mainImage && (
                                    <span className="text-[9px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-1 rounded-md">Sunucudaki Mevcut Görsel</span>
                                )}
                            </div>
                            <ElegantDropZone
                                label="Ana Görsel"
                                image={mainImage}
                                onSelect={setMainImage}
                                onClear={() => setMainImage(null)}
                                existingUrl={existingImages.main}
                            />
                        </div>

                        {/* Hover Görsel Bölümü */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                                    <ImageIcon size={14} className="text-blue-500" /> Hover (Geçiş) Görseli
                                </h4>
                            </div>
                            <ElegantDropZone
                                label="Hover Görsel"
                                image={hoverImage}
                                onSelect={setHoverImage}
                                onClear={() => setHoverImage(null)}
                                existingUrl={existingImages.hover}
                            />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Alt Kısım: Galeri Yönetimi */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                                <UploadCloud size={16} className="text-purple-500" /> Ürün Galerisi
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-6">Maksimum 10 adet yüksek çözünürlüklü görsel ekleyebilirsiniz.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {/* Yeni Dosya Ekleme Butonu/Alanı */}
                            <DropZone onFilesSelected={(files: File[]) => setGallery([...gallery, ...files])} />

                            {/* Mevcut (Sunucudaki) Galeri Görselleri */}
                            {existingImages.gallery?.map((url: string, index: number) => (
                                <div key={`existing-${index}`} className="relative group aspect-[3/4] rounded-3xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm transition-all hover:shadow-xl">
                                    <img src={url} alt="" className="w-full h-full object-cover opacity-60 grayscale-[50%]" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/30">Sunucuda Kayıtlı</span>
                                    </div>
                                </div>
                            ))}

                            {/* Yeni Eklenen (Local) Galeri Görselleri */}
                            {gallery.map((file: File, index: number) => (
                                <div key={`local-${index}`} className="relative group aspect-[3/4] rounded-3xl overflow-hidden border-2 border-black/5 bg-slate-50 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02]">
                                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0">
                                        <button
                                            onClick={() => setGallery(gallery.filter((_: any, i: number) => i !== index))}
                                            className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                        <p className="text-[8px] text-white/80 font-black uppercase truncate tracking-widest">{file.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bilgi Notu */}
                    <div className="bg-slate-50 rounded-3xl p-6 flex items-start gap-4 border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                            <Info size={18} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-600 font-bold uppercase leading-relaxed tracking-tight">
                                İpucu: Ürün görselleri için 3:4 oranında (Örn: 1200x1600px) ve beyaz arka planlı fotoğraflar kullanmanız, e-ticaret sitenizin profesyonel görünümü için önerilir.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 bg-white border-t border-slate-100 flex justify-end sticky bottom-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                    <button
                        onClick={() => setShowMediaModal(false)}
                        className="bg-black hover:bg-zinc-800 text-white font-black text-[12px] uppercase tracking-[0.3em] px-12 py-5 rounded-2xl transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        Değişiklikleri Uygula
                    </button>
                </div>
            </div>
        </div>
    );
}