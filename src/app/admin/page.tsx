"use client";
import { useState } from "react";
import ProductModule from "./product/ProductModule";
import SliderPage from "./slider/page";
import HeroManagerModule from "./modules/HeroManagerModule";
import CategoryModule from "./category/CategoryModule";
import BrandStoryManagerModule from "./modules/BrandStoryManagerModule";
import BrandModule from "./brand/BrandManager";
import AnnouncementBar from "./announcement/AnnouncementManager";
import CustomerModule from "./customer/page";
import AdminOrdersPage from "./orders/page";
import ExtraHeroModule from "./extrahero/page";
import FinancePage from "./finance/page";
import DashboardPage from "./dashboard/page";
import SettingsPage from "./settings/page";
import EmailPage from "./email/EmailManager";
import {
    Package, Tag, Layers, ChevronRight, Monitor,
    LayoutList, Instagram, Megaphone, ChevronDown, Paintbrush, Users, ShoppingCart, Settings, BarChart3, Wallet
} from "lucide-react";

export default function AdminDashboard() {
    const [activeModule, setActiveModule] = useState("products");
    const [isDesignOpen, setIsDesignOpen] = useState(false);

    // Kompakt Menü Öğesi Bileşeni
    const MenuItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button
            onClick={() => setActiveModule(id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 group ${
                activeModule === id
                    ? "bg-[#333537] text-white shadow-sm" // Aktif: Koyu gri/siyah tonu
                    : "text-[#9499a1] hover:bg-[#2d2f31] hover:text-white" // Pasif: Slate gri
            }`}
        >
            <div className="flex items-center gap-2.5">
                <Icon size={16} strokeWidth={activeModule === id ? 2.5 : 2} />
                <span className={`text-[13px] ${activeModule === id ? "font-semibold" : "font-medium"}`}>
                    {label}
                </span>
            </div>
            {activeModule !== id && (
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </button>
    );

    return (
        <div className="fixed inset-0 flex h-screen w-screen bg-white overflow-hidden text-slate-900 font-sans selection:bg-black selection:text-white">
            {/* SOL SIDEBAR - Profesyonel Dark Admin Teması */}
            <aside className="w-64 border-r border-[#2d2f31] flex flex-col bg-[#1e2022] shrink-0 shadow-2xl">
                {/* Logo Alanı */}
                <div className="p-5 border-b border-[#2d2f31] bg-[#1e2022]">
                    <h1 className="text-lg font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
                        Sepya <span className="text-[9px] font-bold not-italic tracking-widest text-[#6c727a]">STUDIO</span>
                    </h1>
                </div>

                {/* Navigasyon - Arka plan rengi ve textler düzenlendi */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 custom-scrollbar bg-[#1e2022]">

                    <div className="mb-4">
                        <p className="px-3 text-[10px] font-bold text-[#5a5f66] uppercase tracking-[0.15em] mb-2">Mağaza Yönetimi</p>
                        <MenuItem id="products" label="Ürünler" icon={Package} />
                        <MenuItem id="orders" label="Siparişler" icon={ShoppingCart} />
                        <MenuItem id="customers" label="Müşteriler" icon={Users} />
                        <MenuItem id="finance" label="Finans" icon={Wallet} />
                        <MenuItem id="stats" label="İstatistikler" icon={BarChart3} />
                        <MenuItem id="categories" label="Kategoriler" icon={Layers} />
                    </div>

                    <div className="mb-4">
                        <p className="px-3 text-[10px] font-bold text-[#5a5f66] uppercase tracking-[0.15em] mb-2">Arayüz & Tasarım</p>
                        <button
                            onClick={() => setIsDesignOpen(!isDesignOpen)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                                isDesignOpen ? "text-white bg-[#2d2f31]" : "text-[#9499a1] hover:bg-[#2d2f31] hover:text-white"
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <Paintbrush size={16} />
                                <span className="text-[13px] font-medium">Görünüm</span>
                            </div>
                            <ChevronDown size={12} className={`transition-transform ${isDesignOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isDesignOpen && (
                            <div className="mt-1 ml-3 pl-3 border-l border-[#3d4146] space-y-0.5">
                                {[
                                    { id: "hero", label: "Hero Banner" },
                                    { id: "extra-hero", label: "Ekstra Hero" },
                                    { id: "slider", label: "Slider" },
                                    { id: "annoucement", label: "Duyuru Barı" },
                                    { id: "brandstory", label: "Instagram Grid" },
                                    { id: "brand", label: "Marka Yönetimi" }
                                ].map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => setActiveModule(sub.id)}
                                        className={`w-full text-left px-3 py-1.5 rounded-md text-[12px] transition-all ${
                                            activeModule === sub.id
                                                ? "text-white font-bold bg-[#3d4146]"
                                                : "text-[#6c727a] hover:text-white hover:bg-[#2d2f31]"
                                        }`}
                                    >
                                        {sub.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="px-3 text-[10px] font-bold text-[#5a5f66] uppercase tracking-[0.15em] mb-2">Sistem</p>
                        <MenuItem id="settings" label="Ayarlar" icon={Settings} />
                        <MenuItem id="email" label="Email Yönetimi" icon={Monitor} />
                    </div>
                </nav>

                {/* Alt Kısım - Profil */}
                <div className="p-4 border-t border-[#2d2f31] bg-[#1a1c1e]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black text-xs font-bold shadow-md">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-white uppercase tracking-tight">Admin Panel</span>
                            <span className="text-[9px] text-[#5a5f66] font-medium uppercase tracking-widest">v2.0.4</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* SAĞ İÇERİK ALANI */}
            <main className="flex-1 h-full bg-[#fcfcfc] overflow-y-auto">
                <div className="w-full h-full">
                    {activeModule === "products" && <ProductModule />}
                    {activeModule === "customers" && <CustomerModule />}
                    {activeModule === "orders" && <AdminOrdersPage />}
                    {activeModule === "stats" && <DashboardPage />}
                    {activeModule === "finance" && <FinancePage />}
                    {activeModule === "slider" && <SliderPage />}
                    {activeModule === "hero" && <HeroManagerModule />}
                    {activeModule === "extra-hero" && <ExtraHeroModule />}
                    {activeModule === "categories" && <CategoryModule />}
                    {activeModule === "brand" && <BrandModule />}
                    {activeModule === "annoucement" && <AnnouncementBar />}
                    {activeModule === "brandstory" && <BrandStoryManagerModule />}
                    {activeModule === "settings" && <SettingsPage />}
                    {activeModule === "email" && <EmailPage />}
                </div>
            </main>
        </div>
    );
}