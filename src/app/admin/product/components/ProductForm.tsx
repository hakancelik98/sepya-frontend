import { useState } from "react";
import { X, Save, Plus, Trash2, ImagePlus, Package, Palette, Box, Tag, Zap, Info } from "lucide-react";

export default function ProductFormWithVariants({ categories, onClose, onSave }: any) {
    const [mainInfo, setMainInfo] = useState({
        title: "", price: "", discountedPrice: "", description: "", categoryId: "",
        size: "", material: "", seasonLabel: "Yeni Sezon"
    });

    const [variants, setVariants] = useState([{ color: "", stockQuantity: 0, images: [] as File[] }]);
    const [mainImages, setMainImages] = useState<File[]>([]);

    const addVariant = () => setVariants([...variants, { color: "", stockQuantity: 0, images: [] }]);

    const removeVariant = (index: number) => {
        if (variants.length > 1) setVariants(variants.filter((_, i) => i !== index));
    };

    const handleMainImageSelect = (e: any) => {
        if (e.target.files) setMainImages([...mainImages, ...Array.from(e.target.files as FileList)]);
    };

    const handleVariantImageSelect = (vIdx: number, e: any) => {
        if (e.target.files) {
            const newVariants = [...variants];
            newVariants[vIdx].images = [...newVariants[vIdx].images, ...Array.from(e.target.files as FileList)];
            setVariants(newVariants);
        }
    };

    const handleSubmit = () => {
        let globalFiles: File[] = [...mainImages];
        const productDTO: any = {
            ...mainInfo,
            mainImageIndex: mainImages.length > 0 ? 0 : null,
            hoverImageIndex: mainImages.length > 1 ? 1 : null,
            galleryImageIndices: mainImages.length > 2 ? mainImages.map((_, i) => i).slice(2).join(",") : "",
            variants: []
        };

        let currentIndex = globalFiles.length;
        variants.forEach(v => {
            const vMainIdx = currentIndex;
            globalFiles = [...globalFiles, ...v.images];
            productDTO.variants.push({
                color: v.color,
                stockQuantity: v.stockQuantity,
                mainImageIndex: v.images.length > 0 ? vMainIdx : null,
                galleryImageIndices: v.images.length > 1 ? v.images.map((_, i) => vMainIdx + i).slice(1).join(",") : ""
            });
            currentIndex += v.images.length;
        });

        onSave(productDTO, globalFiles);
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans selection:bg-blue-100">
            {/* Minimal Modern Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                        <Package size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic italic-none">Ürün Konfigüratörü</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Envanter Birimi v4.2</p>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="group p-3 hover:bg-slate-100 rounded-full transition-all duration-300">
                    <X size={24} className="text-slate-400 group-hover:rotate-90 group-hover:text-slate-900 transition-all" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto p-8 grid grid-cols-12 gap-8">

                    {/* SOL TARAF: Teknik Bilgiler */}
                    <div className="col-span-7 space-y-6">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <Zap size={18} className="text-blue-500" />
                                <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-800">Temel Bilgiler</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-1.5 block tracking-widest group-focus-within:text-blue-500 transition-colors">Ürün İsmi</label>
                                    <input placeholder="Örn: Oversize Kaşmir Palto" className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:bg-white focus:border-slate-900 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300"
                                           onChange={e => setMainInfo({...mainInfo, title: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-1.5 block tracking-widest">Normal Fiyat</label>
                                        <input type="number" placeholder="0.00" className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:bg-white focus:border-slate-900 outline-none transition-all font-mono font-bold"
                                               onChange={e => setMainInfo({...mainInfo, price: e.target.value})} />
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-black uppercase text-blue-500 ml-1 mb-1.5 block tracking-widest italic">İndirimli Fiyat</label>
                                        <input type="number" placeholder="Opsiyonel" className="w-full bg-blue-50/30 border-2 border-transparent rounded-2xl px-5 py-4 focus:bg-white focus:border-blue-500 outline-none transition-all font-mono font-bold text-blue-600"
                                               onChange={e => setMainInfo({...mainInfo, discountedPrice: e.target.value})} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <select className="bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-slate-900 font-bold text-slate-700"
                                            onChange={e => setMainInfo({...mainInfo, categoryId: e.target.value})}>
                                        <option value="">Kategori Seçiniz</option>
                                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <input placeholder="Materyal (%100 Pamuk vb.)" className="bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:bg-white focus:border-slate-900 outline-none transition-all font-semibold"
                                           onChange={e => setMainInfo({...mainInfo, material: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* Varyant Yönetimi */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end px-4">
                                <div>
                                    <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-800">Renk Varyasyonları</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Her renk için ayrı stok ve görsel tanımlayabilirsiniz.</p>
                                </div>
                                <button onClick={addVariant} className="flex items-center gap-2 bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-200">
                                    <Plus size={14} /> Renk Ekle
                                </button>
                            </div>

                            <div className="space-y-4">
                                {variants.map((v, vIdx) => (
                                    <div key={vIdx} className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm relative group animate-in slide-in-from-bottom-4">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-4">
                                                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                                                    <Palette size={16} className="text-slate-400" />
                                                    <input placeholder="Renk" className="bg-transparent w-full outline-none font-bold text-sm"
                                                           onChange={e => {
                                                               const nv = [...variants];
                                                               nv[vIdx].color = e.target.value;
                                                               setVariants(nv);
                                                           }} />
                                                </div>
                                            </div>
                                            <div className="col-span-3">
                                                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                                                    <Box size={16} className="text-slate-400" />
                                                    <input type="number" placeholder="Stok" className="bg-transparent w-full outline-none font-bold text-sm"
                                                           onChange={e => {
                                                               const nv = [...variants];
                                                               nv[vIdx].stockQuantity = parseInt(e.target.value);
                                                               setVariants(nv);
                                                           }} />
                                                </div>
                                            </div>
                                            <div className="col-span-4 flex gap-2 overflow-x-auto">
                                                <label className="flex-shrink-0 w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:text-white transition-all group/img">
                                                    <ImagePlus size={18} />
                                                    <input type="file" multiple className="hidden" onChange={(e) => handleVariantImageSelect(vIdx, e)} />
                                                </label>
                                                {v.images.map((img, i) => (
                                                    <div key={i} className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                                                        <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => removeVariant(vIdx)} className="col-span-1 flex justify-end text-slate-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SAĞ TARAF: Medya ve Detay */}
                    <div className="col-span-5 space-y-6">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                    <Tag size={18} className="text-orange-500" /> Ana Görseller
                                </h3>
                                <span className="text-[9px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-tighter">Min 3:4 Oran</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <label className="col-span-2 aspect-[16/9] border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-slate-900 transition-all group">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                        <ImagePlus className="text-slate-400 group-hover:text-slate-900" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest mt-4 text-slate-400">Görselleri Sürükle</span>
                                    <input type="file" multiple className="hidden" onChange={handleMainImageSelect} />
                                </label>

                                {mainImages.map((img, i) => (
                                    <div key={i} className="aspect-[3/4] rounded-[20px] overflow-hidden border border-slate-100 relative shadow-sm group">
                                        <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-black text-[10px]">INDEX #{i}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-300 relative overflow-hidden group">
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <Info size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Yayınlama Notu</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                                    "Yeni Sezon" etiketi otomatik olarak ürüne tanımlanacaktır. İndirimli fiyat girildiğinde sistem otomatik olarak "İndirim" badge'ini ürün sayfasında aktif eder.
                                </p>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Package size={120} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Sabit Footer Butonu */}
            <div className="p-8 border-t border-slate-100 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
                <div className="max-w-7xl mx-auto flex gap-4">
                    <button onClick={onClose} className="px-8 py-5 rounded-[20px] font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">İptal</button>
                    <button onClick={handleSubmit} className="flex-1 bg-slate-900 hover:bg-black text-white font-black text-sm uppercase tracking-[0.3em] py-5 rounded-[24px] transition-all flex items-center justify-center gap-4 shadow-xl shadow-slate-200 active:scale-[0.98]">
                        <Save size={20} />
                        Ürünü ve {variants.length} Varyantı Yayınla
                    </button>
                </div>
            </div>
        </div>
    );
}