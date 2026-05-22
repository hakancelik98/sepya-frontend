"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, FolderTree, ChevronRight } from "lucide-react";

export default function CategoryModule() {
    const [categories, setCategories] = useState<any[]>([]);
    const [mainCategories, setMainCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // Alt kategori kontrolleri
    const [isSubcategory, setIsSubcategory] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
    const API_ASSET = process.env.NEXT_PUBLIC_ASSET_URL ?? "";

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}/categories`);
            if (!res.ok) throw new Error("Veri çekilemedi");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Kategoriler yüklenemedi:", error);
        }
    };

    const fetchMainCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}/categories/main`);
            if (!res.ok) throw new Error("Ana kategoriler çekilemedi");
            const data = await res.json();
            setMainCategories(data);
        } catch (error) {
            console.error("Ana kategoriler yüklenemedi:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchMainCategories();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) {
            alert("Lütfen bir kategori adı girin.");
            return;
        }

        // Alt kategori ise parent kontrolü
        if (isSubcategory && !selectedParentId) {
            alert("Lütfen bir ana kategori seçin.");
            return;
        }

        // Alt kategori ise görsel yüklenemez
        if (isSubcategory && selectedFile) {
            alert("Alt kategorilere görsel yüklenemez.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("name", newCategory);

        // Sadece ana kategorilerde görsel yüklenebilir
        if (!isSubcategory && selectedFile) {
            formData.append("image", selectedFile);
        }

        // Parent kategori ID'si
        if (isSubcategory && selectedParentId) {
            formData.append("parentCategoryId", selectedParentId.toString());
        }

        try {
            const res = await fetch(`${API_BASE}/categories`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setNewCategory("");
                setSelectedFile(null);
                setIsSubcategory(false);
                setSelectedParentId(null);
                fetchCategories();
                fetchMainCategories();
                alert(isSubcategory ? "Alt kategori başarıyla eklendi!" : "Kategori başarıyla eklendi!");
            } else {
                const errorMsg = await res.text();
                alert(`Hata: ${errorMsg}`);
            }
        } catch (error) {
            console.error("İstek Hatası:", error);
            alert("Sunucuya ulaşılamadı.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`${API_BASE}/categories/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchCategories();
                fetchMainCategories();
            }
        } catch (error) {
            console.error("Silme hatası:", error);
        }
    };

    // Kategorileri hiyerarşik olarak grupla
    const groupedCategories = categories.reduce((acc: any, cat: any) => {
        if (!cat.parentCategory) {
            if (!acc[cat.id]) {
                acc[cat.id] = { ...cat, subcategories: [] };
            }
        } else {
            const parentId = cat.parentCategory.id;
            if (!acc[parentId]) {
                acc[parentId] = { ...cat.parentCategory, subcategories: [] };
            }
            acc[parentId].subcategories.push(cat);
        }
        return acc;
    }, {});

    const sortedCategories = Object.values(groupedCategories).sort((a: any, b: any) => a.id - b.id);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h1>
                    <p className="text-sm text-gray-500 mt-1">Kategorileri ve alt kategorileri yönetin</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* FORM ALANI */}
                    <div className="lg:col-span-1">
                        <form onSubmit={handleAddCategory} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                                {isSubcategory ? "Alt Kategori Ekle" : "Kategori Ekle"}
                            </h2>

                            {/* Kategori Tipi Seçimi */}
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSubcategory(false);
                                        setSelectedParentId(null);
                                    }}
                                    className={`flex-1 py-2 px-3 rounded-md text-xs font-bold transition-all ${
                                        !isSubcategory
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Ana Kategori
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsSubcategory(true)}
                                    className={`flex-1 py-2 px-3 rounded-md text-xs font-bold transition-all ${
                                        isSubcategory
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Alt Kategori
                                </button>
                            </div>

                            {/* Ana Kategori Seçimi (Alt kategori ekleme modunda) */}
                            {isSubcategory && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2">
                                        <FolderTree size={14} className="inline mr-1" />
                                        Üst Kategori
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        value={selectedParentId || ""}
                                        onChange={(e) => setSelectedParentId(Number(e.target.value))}
                                    >
                                        <option value="">Seçiniz</option>
                                        {mainCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Görsel Yükleme (Sadece Ana Kategori için) */}
                            {!isSubcategory && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2">
                                        Kategori Görseli
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer"
                                        />
                                        {selectedFile && (
                                            <p className="mt-2 text-xs text-gray-500">
                                                Seçilen: {selectedFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Kategori Adı */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-2">
                                    <Tag size={14} className="inline mr-1" />
                                    Kategori Adı
                                </label>
                                <input
                                    type="text"
                                    placeholder="Kategori adını girin"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                            </div>

                            {/* Kaydet Butonu */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-3 text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    "İşleniyor..."
                                ) : (
                                    <>
                                        <Plus size={16} />
                                        {isSubcategory ? "Alt Kategori Ekle" : "Kategori Ekle"}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* LİSTE ALANI */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {/* Başlık */}
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase">
                                    <div className="col-span-6">Kategori</div>
                                    <div className="col-span-4">Slug</div>
                                    <div className="col-span-2 text-right">İşlem</div>
                                </div>
                            </div>

                            {/* İçerik */}
                            <div className="divide-y divide-gray-100">
                                {sortedCategories.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <FolderTree className="mx-auto text-gray-300 mb-3" size={48} />
                                        <p className="text-sm font-medium text-gray-400">
                                            Henüz kategori eklenmemiş
                                        </p>
                                    </div>
                                ) : (
                                    sortedCategories.map((cat: any) => (
                                        <div key={cat.id}>
                                            {/* ANA KATEGORİ */}
                                            <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors">
                                                <div className="col-span-6">
                                                    <div className="flex items-center gap-3">
                                                        {cat.imageUrl && (
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                                <img
                                                                    src={
                                                                        cat.imageUrl?.startsWith("http")
                                                                            ? cat.imageUrl
                                                                            : `${API_ASSET}${cat.imageUrl}`
                                                                    }
                                                                    alt={cat.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {cat.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-4">
                                                    <span className="text-xs text-gray-500 font-mono">
                                                        /{cat.slug}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-right">
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Sil"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ALT KATEGORİLER */}
                                            {cat.subcategories && cat.subcategories.length > 0 && (
                                                <div className="bg-gray-50/50">
                                                    {cat.subcategories.map((sub: any) => (
                                                        <div
                                                            key={sub.id}
                                                            className="grid grid-cols-12 gap-4 px-4 py-1 pl-16 items-center hover:bg-gray-100 transition-colors border-l-2 border-gray-300"
                                                        >
                                                            <div className="col-span-6">
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <ChevronRight size={14} className="text-gray-400" />
                                                                    <span className="font-medium text-gray-700">
                                                                        {sub.name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-4">
                                                                <span className="text-xs text-gray-400 font-mono">
                                                                    /{sub.slug}
                                                                </span>
                                                            </div>
                                                            <div className="col-span-2 text-right">
                                                                <button
                                                                    onClick={() => handleDelete(sub.id)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                                    title="Sil"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}