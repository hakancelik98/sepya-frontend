"use client";

import { Search, Edit2, Trash2, Copy, Image as ImageIcon, Tag, Palette, Ruler, Box, Sparkles, Layers } from "lucide-react";

export default function ProductList({ filteredProducts, handleEdit, handleDelete, handleDuplicate, setSearchTerm }: any) {
    return (
        <div className="h-full flex flex-col bg-white">
            {/* Minimal Arama ve Araç Çubuğu */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Ürün, SKU, Kategori veya Materyal ara..."
                        className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-[11px] focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Envanter: <span className="text-slate-900">{filteredProducts.length} Ürün</span>
                    </div>
                </div>
            </div>

            {/* Excel Tipi Geniş Tablo */}
            <div className="flex-1 overflow-auto scrollbar-thin">
                <table className="w-full border-collapse min-w-[1200px]">
                    <thead className="sticky top-0 bg-gray-200 border-b border-slate-200 z-10 shadow-sm">
                    <tr className="text-[9px] font-black text-slate-900 uppercase tracking-[0.1em] text-left">
                        <th className="px-4 py-4 w-16 text-center">Görsel</th>
                        <th className="px-4 py-4 min-w-[200px]">Ürün Adı & SKU</th>
                        <th className="px-4 py-4 w-20">Stok</th>
                        <th className="px-4 py-4 w-32">Marka</th>
                        <th className="px-4 py-4 w-32">Kategori</th>
                        <th className="px-4 py-4 w-28">Fiyat</th>
                        <th className="px-4 py-4 w-28">İndirimli F.</th>
                        <th className="px-4 py-4 w-24"><div className="flex items-center gap-1"><Palette size={10}/> Renk</div></th>
                        <th className="px-4 py-4 w-24"><div className="flex items-center gap-1"><Ruler size={10}/> Boyut</div></th>
                        <th className="px-4 py-4 w-16">Materyal</th>
                        <th className="px-4 py-4 w-32">Etiket</th>
                        <th className="px-4 py-4 w-24 text-right">Aksiyon</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                    {filteredProducts.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-200 transition-colors group">
                            {/* Görsel */}
                            <td className="px-4 py-2">
                                <div className="w-10 h-12 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden mx-auto shadow-sm group-hover:border-blue-300 transition-all">
                                    {p.imageUrl ? (
                                        <img
                                            src={
                                                p.imageUrl.startsWith("http")
                                                    ? p.imageUrl
                                                    : `${process.env.NEXT_PUBLIC_ASSET_URL}${p.imageUrl}`
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ImageIcon size={14} />
                                        </div>
                                    )}
                                </div>
                            </td>

                            {/* Ürün & SKU */}
                            <td className="px-4 py-2">
                                <div className="flex flex-col">
                                        <span className="text-[12px] font-bold text-slate-700 leading-tight group-hover:text-blue-600 truncate max-w-[220px]">
                                            {p.title}
                                        </span>
                                    <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">{p.sku || 'N/A'}</span>
                                </div>
                            </td>

                            {/* Stok */}
                            <td className="px-4 py-2">
                                <div className={`text-[11px] font-black ${p.stockQuantity <= 1 ? 'text-red-500 font-bold' : 'text-slate-700'}`}>
                                    {p.stockQuantity}
                                </div>
                            </td>

                            <td className="px-4 py-2">
                                    <span className="px-2 py-1 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tighter">
                                        {typeof p.brand === 'object' ? p.brand?.name : (p.brand || "Genel")}
                                    </span>
                            </td>

                            {/* Kategori */}
                            <td className="px-4 py-2">
                                    <span className="px-2 py-1 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tighter">
                                        {p.category?.name || "Genel"}
                                    </span>
                            </td>

                            {/* Fiyatlar */}
                            <td className="px-4 py-2 font-mono text-[11px] font-bold text-slate-500">
                                {p.price?.toLocaleString('tr-TR')}₺
                            </td>
                            <td className="px-4 py-2 font-mono text-[11px] font-black text-emerald-600">
                                {p.discountedPrice > 0 ? `${p.discountedPrice?.toLocaleString('tr-TR')}₺` : '—'}
                            </td>

                            {/* Renk */}
                            <td className="px-4 py-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full border border-slate-200 bg-slate-400 shadow-sm" style={{ backgroundColor: p.colorCode }} />
                                    <span className="text-[10px] font-medium text-slate-600 capitalize">{p.color || '—'}</span>
                                </div>
                            </td>

                            {/* Boyut */}
                            <td className="px-4 py-2">
                                <span className="text-[10px] font-bold text-slate-500">{p.size || 'STD'}</span>
                            </td>

                            {/* Materyal */}
                            <td className="px-4 py-2">
                                    <span className="text-[10px] text-slate-500 italic truncate block max-w-[100px]" title={p.material}>
                                        {p.material || '—'}
                                    </span>
                            </td>

                            {/* Sezon Etiketi */}
                            <td className="px-4 py-2">
                                {p.seasonLabel && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-100 rounded text-[9px] font-black uppercase tracking-tighter">
                                            {p.seasonLabel}
                                        </span>
                                )}
                            </td>

                            {/* İşlemler */}
                            <td className="px-4 py-2 text-right">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Düzenle"><Edit2 size={13}/></button>
                                    <button onClick={() => handleDuplicate(p)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Kopyala"><Copy size={13}/></button>
                                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Sil"><Trash2 size={13}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}