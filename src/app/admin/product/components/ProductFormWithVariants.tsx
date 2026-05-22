import { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, ImagePlus, Package, Palette, Camera, Hash, Layers, Tag, Ruler, Box } from "lucide-react";

export default function ProductFormWithVariants({ categories, brands, editingProduct, onClose, onSave }: any) {
    const [isVisible, setIsVisible] = useState(false);
    const isEdit = !!editingProduct;

    // ANA BİLGİLER
    const [mainInfo, setMainInfo] = useState({
        title: "", description: "", price: "", discountedPrice: "0", categoryId: "",
        modelNo: "", color: "", size: "", material: "", stockQuantity: 0, seasonLabel: "", brand: ""
    });

    // YENİ: İKİ AŞAMALI KATEGORİ SEÇİMİ
    const [mainCategories, setMainCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [hoverImage, setHoverImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [variants, setVariants] = useState<any[]>([]);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    // Ana kategorileri yükle
    useEffect(() => {
        fetch(`${API_BASE}/categories/main`)
            .then(res => res.json())
            .then(data => setMainCategories(data))
            .catch(err => console.error("Ana kategoriler yüklenemedi:", err));
    }, []);

    // Ana kategori değiştiğinde alt kategorileri yükle
    useEffect(() => {
        if (selectedMainCategoryId) {
            fetch(`${API_BASE}/categories/${selectedMainCategoryId}/subcategories`)
                .then(res => res.json())
                .then(data => {
                    setSubcategories(data);
                    if (data.length === 0) {
                        setSelectedSubcategoryId(null);
                    }
                })
                .catch(err => console.error("Alt kategoriler yüklenemedi:", err));
        } else {
            setSubcategories([]);
            setSelectedSubcategoryId(null);
        }
    }, [selectedMainCategoryId]);

    useEffect(() => {
        setIsVisible(true);
        if (editingProduct) {
            setMainInfo({
                title: editingProduct.title || "",
                description: editingProduct.description || "",
                price: editingProduct.price || "",
                discountedPrice: editingProduct.discountedPrice || "0",
                categoryId: editingProduct.category?.id || "",
                modelNo: editingProduct.modelNo || "",
                color: editingProduct.color || "",
                size: editingProduct.size || "",
                material: editingProduct.material || "",
                stockQuantity: editingProduct.stockQuantity || 0,
                seasonLabel: editingProduct.seasonLabel || "Yeni Sezon",
                brand: editingProduct.brand || ""
            });

            // Düzenleme modunda kategori seçimini ayarla
            if (editingProduct.category) {
                const categoryId = editingProduct.category.id;
                // Kategorinin parent'ı varsa alt kategori, yoksa ana kategori
                if (editingProduct.category.parentCategory) {
                    setSelectedMainCategoryId(editingProduct.category.parentCategory.id);
                    setSelectedSubcategoryId(categoryId);
                } else {
                    setSelectedMainCategoryId(categoryId);
                    setSelectedSubcategoryId(null);
                }
            }

            setVariants([]);
        }
    }, [editingProduct]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    // FORM GÖNDERME
    const handleSubmit = () => {
        // Eğer alt kategori seçildiyse onu kullan, yoksa ana kategoriyi kullan
        const finalCategoryId = selectedSubcategoryId || selectedMainCategoryId;

        if (!finalCategoryId) {
            alert("Lütfen bir kategori seçin!");
            return;
        }

        const allFiles: File[] = [];
        if (mainImage) allFiles.push(mainImage);
        if (hoverImage) allFiles.push(hoverImage);
        allFiles.push(...galleryImages);

        let currentFileIdx = allFiles.length;

        // ANA ÜRÜNÜ OLUŞTUR
        const productDTO = {
            ...mainInfo,
            id: isEdit ? editingProduct.id : null,
            categoryId: finalCategoryId, // Alt kategori varsa onu, yoksa ana kategoriyi kullan
            title: isEdit
                ? mainInfo.title.trim()
                : `${mainInfo.title} ${mainInfo.color}`.trim(),

            sku: `${mainInfo.modelNo}-${mainInfo.color.toUpperCase().replace(/\s+/g, '')}`,

            mainImageIndex: mainImage ? 0 : null,
            hoverImageIndex: hoverImage ? (mainImage ? 1 : 0) : null,
            galleryImageIndices: galleryImages.length > 0
                ? galleryImages.map((_, i) => (mainImage ? 1 : 0) + (hoverImage ? 1 : 0) + i).join(",")
                : "",

            // VARYANTLARI OLUŞTUR
            variants: variants.map((v) => {
                const startIdx = currentFileIdx;
                if (v.mainImg) allFiles.push(v.mainImg);
                if (v.hoverImg) allFiles.push(v.hoverImg);
                if (v.gallery) allFiles.push(...v.gallery);

                const vFilesCount = (v.mainImg ? 1 : 0) + (v.hoverImg ? 1 : 0) + (v.gallery?.length || 0);

                const variantData = {
                    title: `${mainInfo.title} ${v.color}`.trim(),
                    color: v.color,
                    stockQuantity: v.stockQuantity,
                    sku: `${mainInfo.modelNo}-${v.color.toUpperCase().replace(/\s+/g, '')}`,
                    mainImageIndex: v.mainImg ? startIdx : null,
                    hoverImageIndex: v.hoverImg ? (v.mainImg ? startIdx + 1 : startIdx) : null,
                    galleryImageIndices: v.gallery?.length > 0
                        ? v.gallery.map((_:any, i:number) => startIdx + (v.mainImg ? 1 : 0) + (v.hoverImg ? 1 : 0) + i).join(",")
                        : ""
                };
                currentFileIdx += vFilesCount;
                return variantData;
            })
        };

        onSave(productDTO, allFiles);
    };

    return (
        <div className="fixed inset-0 z-[1001] flex justify-end">
            <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />
            <div className={`relative w-full max-w-5xl bg-[#f8fafc] shadow-2xl transform transition-transform duration-500 flex flex-col h-full ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="p-6 bg-white border-b flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl flex items-center justify-center shadow-lg">
                            <Package className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-[0.2em] text-slate-900">
                                {isEdit ? "Ürünü Düzenle" : "Yeni Ürün"}
                            </h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                {isEdit ? "Mevcut ürünü güncelle" : "Varyantlı ürün ekle"}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Medya Yönetimi */}
                    <div className="bg-white p-5 rounded-2xl border space-y-3">
                        <div className="flex items-center gap-2 pb-3 border-b">
                            <Camera size={16} className="text-indigo-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ana Ürün Görselleri</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <label className="h-32 bg-gradient-to-br from-slate-50 to-white border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all relative overflow-hidden group">
                                {mainImage ? (
                                    <>
                                        <img src={URL.createObjectURL(mainImage)} className="absolute inset-0 w-full h-full object-cover" alt="Main" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-[10px] font-bold">Değiştir</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ImagePlus className="text-slate-300 mb-1" size={20} />
                                        <span className="text-[8px] font-black text-slate-400 uppercase">Ana Görsel</span>
                                    </>
                                )}
                                <input type="file" className="hidden" onChange={(e) => setMainImage(e.target.files?.[0] || null)} />
                            </label>
                            <label className="h-32 bg-gradient-to-br from-slate-50 to-white border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all relative overflow-hidden group">
                                {hoverImage ? (
                                    <>
                                        <img src={URL.createObjectURL(hoverImage)} className="absolute inset-0 w-full h-full object-cover" alt="Hover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-[10px] font-bold">Değiştir</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ImagePlus className="text-slate-300 mb-1" size={20} />
                                        <span className="text-[8px] font-black text-slate-400 uppercase">Hover Görsel</span>
                                    </>
                                )}
                                <input type="file" className="hidden" onChange={(e) => setHoverImage(e.target.files?.[0] || null)} />
                            </label>
                            <label className="h-32 bg-gradient-to-br from-indigo-50 to-white border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all relative overflow-hidden">
                                <Layers className="text-indigo-300 mb-1" size={20} />
                                <span className="text-[8px] font-black text-indigo-400 uppercase">Galeri</span>
                                <span className="text-[10px] font-black text-indigo-600 mt-1">{galleryImages.length} Görsel</span>
                                <input type="file" multiple className="hidden" onChange={(e) => setGalleryImages([...galleryImages, ...Array.from(e.target.files || [])])} />
                            </label>
                        </div>
                    </div>

                    {/* Ürün Bilgileri */}
                    <div className="bg-white p-6 rounded-3xl border space-y-5">
                        <div className="flex items-center gap-3 pb-4 border-b">
                            <Hash size={20} className="text-emerald-500" />
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Ürün Detayları</span>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ürün Başlığı *</label>
                                    <input className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-xs font-bold outline-none border focus:border-slate-300" placeholder="Örn: Twill Eşarp" value={mainInfo.title} onChange={e => setMainInfo({...mainInfo, title: e.target.value})} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model No *</label>
                                    <input className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-xs font-bold outline-none" placeholder="Örn: ES-2024-001" value={mainInfo.modelNo} onChange={e => setMainInfo({...mainInfo, modelNo: e.target.value})} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Beden</label>
                                    <input className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-xs font-bold outline-none" placeholder="Örn: STD" value={mainInfo.size} onChange={e => setMainInfo({...mainInfo, size: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Malzeme</label>
                                    <input className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-xs font-bold outline-none" placeholder="Örn: %100 İpek" value={mainInfo.material} onChange={e => setMainInfo({...mainInfo, material: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ana Renk *</label>
                                    <input className="w-full px-4 py-2.5 bg-white border-2 border-blue-100 rounded-lg text-xs font-bold outline-none shadow-sm" placeholder="Mavi" value={mainInfo.color} onChange={e => setMainInfo({...mainInfo, color: e.target.value})} />
                                </div>
                            </div>

                            {/* YENİ: İKİ AŞAMALI KATEGORİ SEÇİMİ */}
                            <div className="space-y-4">
                                {/* ANA KATEGORİ */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1">
                                        <Tag size={12}/> Ana Kategori *
                                    </label>
                                    <select
                                        value={selectedMainCategoryId || ""}
                                        onChange={(e) => setSelectedMainCategoryId(Number(e.target.value) || null)}
                                        className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black outline-none"
                                        required
                                    >
                                        <option value="">Seçiniz...</option>
                                        {mainCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* ALT KATEGORİ (Ana kategori seçiliyse göster) */}
                                {selectedMainCategoryId && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                                            <Tag size={12}/> Alt Kategori (Opsiyonel)
                                        </label>
                                        {subcategories.length > 0 ? (
                                            <select
                                                value={selectedSubcategoryId || ""}
                                                onChange={(e) => setSelectedSubcategoryId(Number(e.target.value) || null)}
                                                className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black outline-none"
                                            >
                                                <option value="">Seçim yapma (Ana kategori kullanılacak)</option>
                                                {subcategories.map((sub) => (
                                                    <option key={sub.id} value={sub.id}>
                                                        {sub.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic px-4 py-2 bg-gray-50 rounded-lg">
                                                Bu kategorinin alt kategorisi bulunmuyor
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-green-600 uppercase flex items-center gap-1">
                                        <Tag size={12}/> Marka
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg text-[10px] font-black outline-none"
                                        value={mainInfo.brand}
                                        onChange={e => setMainInfo({...mainInfo, brand: e.target.value})}
                                    >
                                        <option value="">Seçiniz</option>
                                        {brands?.map((brand: any) => (
                                            <option key={brand.id} value={brand.name}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-orange-600 uppercase flex items-center gap-1">
                                        <Tag size={12}/> Sezon
                                    </label>
                                    <select className="w-full px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-[10px] font-black outline-none" value={mainInfo.seasonLabel} onChange={e => setMainInfo({...mainInfo, seasonLabel: e.target.value})}>
                                        <option value="Seçiniz">Seçiniz</option>
                                        <option value="Yeni Sezon">Yeni Sezon</option>
                                        <option value="Fırsat">Fırsat</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Fiyat *</label>
                                    <input className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold outline-none" value={mainInfo.price} onChange={e => setMainInfo({...mainInfo, price: e.target.value})} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-emerald-600 uppercase">İndirimli Fiyat</label>
                                    <input className="w-full px-3 py-2 bg-emerald-50 rounded-lg text-xs font-bold outline-none" value={mainInfo.discountedPrice} onChange={e => setMainInfo({...mainInfo, discountedPrice: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Stok Adedi</label>
                                    <input type="number" className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold outline-none" value={mainInfo.stockQuantity} onChange={e => setMainInfo({...mainInfo, stockQuantity: parseInt(e.target.value)})} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">Açıklama</label>
                                <textarea
                                    className="w-full px-3 py-2 bg-slate-50 rounded-lg text-xs font-bold outline-none resize-none"
                                    rows={2}
                                    value={mainInfo.description}
                                    onChange={e => setMainInfo({...mainInfo, description: e.target.value})}
                                    placeholder="Ürün açıklaması..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Varyant Yönetimi */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                            <span className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-2"><Palette size={18} className="text-indigo-500"/> Renk Varyantları</span>
                            <button onClick={() => setVariants([...variants, { color: "", stockQuantity: 0, mainImg: null, hoverImg: null, gallery: [] }])} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 shadow-lg flex items-center gap-2">
                                <Plus size={14} /> Renk Ekle
                            </button>
                        </div>

                        <div className="space-y-3">
                            {variants.map((v, i) => (
                                <div key={i} className="bg-white p-5 rounded-[2.5rem] border flex items-center gap-6 relative group hover:border-indigo-100">
                                    <button onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 border opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>

                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Renk</label>
                                            <input className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none border focus:border-indigo-200" placeholder="Sarı" value={v.color} onChange={e => {
                                                const n = [...variants]; n[i].color = e.target.value; setVariants(n);
                                            }} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Stok</label>
                                            <input type="number" className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none" value={v.stockQuantity} onChange={e => {
                                                const n = [...variants]; n[i].stockQuantity = parseInt(e.target.value); setVariants(n);
                                            }} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-blue-500 uppercase ml-1">Varyant Adı</label>
                                            <div className="w-full px-4 py-2.5 bg-blue-50/30 rounded-xl text-[10px] font-bold text-blue-600 border border-blue-50 flex items-center">
                                                {mainInfo.title} {v.color || "---"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Varyant Medya */}
                                    <div className="flex items-center gap-2 border-l pl-6 shrink-0">
                                        <label className={`w-10 h-14 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer ${v.mainImg ? 'border-blue-500' : 'border-slate-200'}`}>
                                            {v.mainImg ? <img src={URL.createObjectURL(v.mainImg)} className="w-full h-full object-cover rounded-lg" /> : <div className="text-[7px] font-black text-slate-300 uppercase">Ana</div>}
                                            <input type="file" className="hidden" onChange={e => { const n = [...variants]; n[i].mainImg = e.target.files?.[0]; setVariants(n); }} />
                                        </label>
                                        <label className={`w-10 h-14 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer ${v.hoverImg ? 'border-indigo-500' : 'border-slate-200'}`}>
                                            {v.hoverImg ? <img src={URL.createObjectURL(v.hoverImg)} className="w-full h-full object-cover rounded-lg" /> : <div className="text-[7px] font-black text-slate-300 uppercase">Hov</div>}
                                            <input type="file" className="hidden" onChange={e => { const n = [...variants]; n[i].hoverImg = e.target.files?.[0]; setVariants(n); }} />
                                        </label>
                                        <label className="w-10 h-14 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                                            <ImagePlus size={14} className="text-slate-300" />
                                            <span className="text-[7px] font-black text-slate-400">{v.gallery?.length || 0}</span>
                                            <input type="file" multiple className="hidden" onChange={e => { const n = [...variants]; n[i].gallery = [...(n[i].gallery || []), ...Array.from(e.target.files || [])]; setVariants(n); }} />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-white border-t flex items-center gap-4 shrink-0 shadow-2xl">
                    <button onClick={handleClose} className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">İptal</button>
                    <button onClick={handleSubmit} className="flex-1 bg-slate-900 hover:bg-black text-white font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3">
                        <Save size={18} />
                        {isEdit ? "Ürünü Güncelle" : `${variants.length + 1} Ürünü Yayınla`}
                    </button>
                </div>
            </div>
        </div>
    );
}