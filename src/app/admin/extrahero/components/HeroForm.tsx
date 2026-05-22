'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, Globe, Tag, Award } from 'lucide-react';
import { ExtraHero } from '../types';
import { heroService } from '../services/heroService';

interface HeroFormProps {
    hero: ExtraHero;
    onChange: (hero: ExtraHero) => void;
}

const HeroForm: React.FC<HeroFormProps> = ({ hero, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    // Veri kaynakları için state'ler
    const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);
    const [brands, setBrands] = useState<string[]>([]);

    // Verileri yükle
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                // Kategorileri çek
                const catRes = await fetch(`${API_BASE}/categories`);
                const catData = await catRes.json();
                setCategories(catData);

                // Ürünlerden benzersiz markaları üret
                const prodRes = await fetch(`${API_BASE}/products`);
                const prodData = await prodRes.json();
                const uniqueBrands = Array.from(new Set(prodData.map((p: any) => p.brand))).filter(Boolean) as string[];
                setBrands(uniqueBrands);
            } catch (error) {
                console.error("Metadata yükleme hatası:", error);
            }
        };
        fetchMetadata();
    }, []);

    const update = (patch: Partial<ExtraHero>) => {
        onChange({ ...hero, ...patch });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert('5MB sınırı!'); return; }

        try {
            setUploading(true);
            const imageUrl = await heroService.uploadImage(file);
            update({ imageUrl });
        } catch {
            alert('Yükleme hatası');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* TEMEL BİLGİLER */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Genel Ayarlar</h3>
                <div>
                    <label className="block text-xs font-semibold mb-2">Hero Adı (Yönetim İçin)</label>
                    <input
                        value={hero.name}
                        onChange={e => update({ name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Örn: Yaz Kampanyası Ana Banner"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        checked={hero.isActive}
                        onChange={e => update({ isActive: e.target.checked })}
                    />
                    <span className="font-medium text-gray-700">Yayında ve Aktif</span>
                </label>
            </section>

            {/* GÖRSEL VE TASARIM */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Görsel ve Stil</h3>

                <div>
                    <label className="block text-xs font-semibold mb-2 text-gray-600">Arka Plan Görseli</label>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="px-4 py-2 border rounded-lg flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Upload size={16}/>
                            <span className="text-sm font-medium">{uploading ? 'Yükleniyor...' : 'Görsel Yükle'}</span>
                        </button>
                        {hero.imageUrl && <span className="text-green-600 text-xs font-bold">✓ Yüklendi</span>}
                    </div>
                    <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileSelect} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-600">Yükseklik: {hero.height}</label>
                        <input
                            type="range" min="200" max="900" step="50"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            value={parseInt(hero.height)}
                            onChange={e => update({ height: `${e.target.value}px` })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-600">Yedek Renk</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                className="h-9 w-12 rounded cursor-pointer border-none"
                                value={hero.backgroundColor}
                                onChange={e => update({ backgroundColor: e.target.value })}
                            />
                            <span className="text-xs font-mono text-gray-500 uppercase">{hero.backgroundColor}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* AKILLI LİNK SİSTEMİ */}
            <section className="space-y-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <LinkIcon size={18} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Tıklama Davranışı</h3>
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-2 text-gray-600">Bağlantı Tipi</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'NONE', label: 'Yok', icon: null },
                            { id: 'EXTERNAL', label: 'Dış Link', icon: <Globe size={14}/> },
                            { id: 'CATEGORY', label: 'Kategori', icon: <Tag size={14}/> },
                            { id: 'BRAND', label: 'Marka', icon: <Award size={14}/> }
                        ].map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => update({ linkType: type.id as any, linkValue: '' })}
                                className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                                    hero.linkType === type.id
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                {type.icon} {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dinamik Değer Seçici */}
                <div className="mt-3">
                    {hero.linkType === 'EXTERNAL' && (
                        <input
                            type="text"
                            placeholder="https://example.com"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={hero.linkValue}
                            onChange={e => update({ linkValue: e.target.value })}
                        />
                    )}

                    {hero.linkType === 'CATEGORY' && (
                        <select
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={hero.linkValue}
                            onChange={e => update({ linkValue: e.target.value })}
                        >
                            <option value="">Koleksiyon Seçin...</option>
                            {categories.map(cat => (
                                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                            ))}
                        </select>
                    )}

                    {hero.linkType === 'BRAND' && (
                        <select
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={hero.linkValue}
                            onChange={e => update({ linkValue: e.target.value })}
                        >
                            <option value="">Marka Seçin...</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    )}

                    {hero.linkType !== 'NONE' && (
                        <p className="mt-2 text-[10px] text-blue-500 font-medium italic">
                            * Bu hero tıklandığında {hero.linkType.toLowerCase()} sayfasına yönlendirilecek.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HeroForm;