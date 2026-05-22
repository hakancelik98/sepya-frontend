"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import BrandItem from "./BrandItem";

interface BrandData {
    id?: number;
    name: string;
    description: string;
    slug: string;
    imageUrl: string;
    displayOrder: number;
    active: boolean;
    newImage?: File;
    imagePreviewUrl?: string;
}

export default function BrandManager() {
    const [items, setItems] = useState<BrandData[]>([]);
    const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    const fetchBrands = async () => {
        try {
            const response = await fetch(`${API_BASE}/brands`);
            if (!response.ok) throw new Error("Markalar yüklenemedi");
            const data = await response.json();
            setItems(data);
        } catch (err) {
            setError("Veri çekme hatası oluştu.");
        }
    };

    const handleCreate = () => {
        const newBrand: BrandData = {
            name: "",
            description: "",
            slug: "",
            imageUrl: "",
            displayOrder: items.length,
            active: true
        };
        setItems([newBrand, ...items]);
    };

    const handleUpdate = async (id: number | undefined, index: number) => {
        setLoadingIdx(index);
        const item = items[index];
        const formData = new FormData();

        formData.append("name", item.name);
        formData.append("description", item.description);
        formData.append("slug", item.slug);
        if (item.newImage) {
            formData.append("image", item.newImage);
        }

        try {
            const url = id
                ? `${API_BASE}/brands/${id}`
                : `${API_BASE}/brands`;
            const method = id ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (response.ok) {
                alert("Başarıyla kaydedildi.");
                fetchBrands();
            }
        } catch (err) {
            alert("Kaydedilirken hata oluştu.");
        } finally {
            setLoadingIdx(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`${API_BASE}/brands/${id}`, {
                method: "DELETE"
            });
            if (res.ok) fetchBrands();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleStatus = async (id: number) => {
        if (!id) return; // ID yoksa işlemi durdur

        try {
            const res = await fetch(`${API_BASE}/brands/${id}/toggle`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (res.ok) {
                fetchBrands(); // Listeyi yenile
            } else {
                const errorText = await res.text();
                console.error("Sunucu Hatası:", errorText);
                alert("Durum güncellenemedi.");
            }
        } catch (err) {
            console.error("Ağ Hatası (Failed to fetch):", err);
            alert("Sunucuya bağlanılamadı. Lütfen backend'in çalıştığından ve CORS izinlerinin verildiğinden emin olun.");
        }
    };

    const handleFieldChange = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleImageChange = (index: number, file: File) => {
        const newItems = [...items];
        newItems[index].newImage = file;
        newItems[index].imagePreviewUrl = URL.createObjectURL(file);
        setItems(newItems);
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-black text-4xl font-light tracking-tighter">
                            MARKA <span className="text-black">YÖNETİMİ</span>
                        </h1>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#8C7B65] hover:text-white transition-all flex items-center gap-2"
                    >
                        <Plus size={14} /> YENİ MARKA EKLE
                    </button>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    {items.map((item, idx) => (
                        <BrandItem
                            key={item.id || `new-${idx}`}
                            index={idx}
                            item={item}
                            loading={loadingIdx === idx}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                            onChange={handleFieldChange}
                            onImageChange={handleImageChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}