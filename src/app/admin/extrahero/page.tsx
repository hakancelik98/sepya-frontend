"use client";

import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import HeroList from "./components/HeroList";
import HeroForm from "./components/HeroForm";
import HeroPreview from "./components/HeroPreview";
import { heroService } from "./services/heroService";
import { ExtraHero } from "./types";

const EMPTY_HERO: ExtraHero = {
    name: "",
    isActive: false,
    displayOrder: 0,
    imageUrl: "",
    height: "600px",
    backgroundColor: "#1f2937",
    linkType: 'NONE', // 👈 Bunu mutlaka ekleyin
    linkValue: ""
};

export default function HeroAdminPage() {
    const [heroes, setHeroes] = useState<ExtraHero[]>([]);
    const [loading, setLoading] = useState(true);

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [formData, setFormData] = useState<ExtraHero>(EMPTY_HERO);

    useEffect(() => {
        loadHeroes();
    }, []);

    const loadHeroes = async () => {
        try {
            setLoading(true);
            const data = await heroService.getAll();
            setHeroes(data);
        } catch {
            alert("Hero listesi yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    const openNewHero = () => {
        setFormData(EMPTY_HERO);
        setIsEditorOpen(true);
    };

    const openEditHero = (hero: ExtraHero) => {
        setFormData(hero);
        setIsEditorOpen(true);
    };

    const closeEditor = () => {
        setIsEditorOpen(false);
        setFormData(EMPTY_HERO);
    };

    const handleSave = async () => {
        try {
            await heroService.save(formData);
            await loadHeroes();
            closeEditor();
        } catch {
            alert("Hero kaydedilemedi");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* PAGE HEADER */}
            <div className="bg-white border-b px-8 py-5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Hero Yönetimi</h1>
                        <p className="text-sm text-gray-600">
                            Anasayfa görsel alanlarını yönetin
                        </p>
                    </div>

                    <button
                        onClick={openNewHero}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
                    >
                        <Plus size={18} />
                        Yeni Hero
                    </button>
                </div>
            </div>

            {/* LIST */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                <HeroList
                    heroes={heroes}
                    onEdit={openEditHero}
                    onDelete={async (id) => {
                        if (window.confirm("Silinsin mi?")) {
                            await heroService.delete(id);
                            loadHeroes();
                        }
                    }}
                    onToggleActive={async (hero) => {
                        if (hero.id) {
                            await heroService.toggleActive(hero.id);
                            loadHeroes();
                        }
                    }}
                    onMoveUp={() => {}}
                    onMoveDown={() => {}}
                />
            </div>

            {/* EDITOR MODAL */}
            {isEditorOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <div className="bg-white w-[95vw] h-[95vh] rounded-2xl overflow-hidden flex flex-col">

                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between px-8 py-4 border-b">
                            <div>
                                <h2 className="text-xl font-bold">
                                    {formData.id ? "Hero Düzenle" : "Yeni Hero"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Görsel ve boyut ayarları
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isActive: e.target.checked })
                                        }
                                    />
                                    Yayında
                                </label>

                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl"
                                >
                                    Kaydet
                                </button>

                                <button onClick={closeEditor}>
                                    <X size={22} />
                                </button>
                            </div>
                        </div>

                        {/* MODAL BODY */}
                        <div className="flex flex-1 overflow-hidden">

                            {/* SETTINGS */}
                            <div className="w-[460px] border-r p-8 overflow-y-auto bg-gray-50">
                                <HeroForm
                                    hero={formData}
                                    onChange={setFormData}
                                />
                            </div>

                            {/* PREVIEW */}
                            <div className="flex-1 bg-neutral-900 p-10 overflow-auto">
                                <div className="max-w-[1400px] mx-auto">
                                    <HeroPreview hero={formData} />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
