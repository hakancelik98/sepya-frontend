"use client";
import { useState, useEffect } from "react";
import { PasswordModal } from "./PasswordModal";
import { User as UserIcon, Mail, Phone, ShieldCheck, Loader2, ArrowRight } from "lucide-react";

export default function ProfilePage() {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [phone, setPhone] = useState("");

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(`${API_BASE}/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setPhone(data.phone || "");
                }
            } catch (error) {
                console.error("Profil yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);
    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/users/profile`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ phone: phone })
            });
            if (res.ok) alert("Profil başarıyla güncellendi.");
        } catch (error) {
            alert("Güncelleme başarısız.");
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="animate-spin text-black" size={32} />
        </div>
    );

    return (
        /* pt-4: Mobilde çok yukarı yapışmaması için az bir boşluk, md:pt-2: Masaüstünde senin istediğin gibi */
        <div className="max-w-4xl mx-auto px-4 pt-4 md:pt-2 pb-8">
            {/* Header Section - Mobilde yazı boyutunu küçülttük */}
            <header className="mb-4 md:mb-6 border-b border-gray-100 pb-4">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">Hesap Detayları</h1>
                <p className="text-[10px] md:text-xs text-zinc-500 mt-1">Kişisel bilgilerinizi yönetin ve güvenliğinizi sağlayın.</p>
            </header>

            {/* space-y-6: Mobilde bölümler arası mesafeyi daralttık */}
            <div className="space-y-6 md:space-y-8">

                {/* Personal Information Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="h-px w-6 bg-black"></span>
                        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black">Kişisel Bilgiler</h2>
                    </div>

                    {/* gap-y-4: Mobilde alt alta binen elemanların arasını daralttık */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ad Soyad</label>
                            <p className="text-sm md:text-base font-semibold text-zinc-800 border-b border-transparent py-1 uppercase tracking-tight">
                                {user?.firstName} {user?.lastName}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">E-Posta Adresi</label>
                            <p className="text-sm md:text-base font-semibold text-zinc-800 border-b border-transparent py-1 tracking-tight break-all">
                                {user?.email}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider">Telefon Numarası</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="05XX XXX XX XX"
                                className="w-full bg-transparent border-b border-zinc-200 py-1 text-sm md:text-base font-semibold text-black outline-none focus:border-black transition-all placeholder:text-zinc-300"
                            />
                        </div>

                        {/* Mobilde butonu tam genişlik (w-full) yaparak daha kolay tıklanabilir hale getirdik */}
                        <div className="flex items-end pt-2">
                            <button
                                onClick={handleUpdateProfile}
                                className="group w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-lg"
                            >
                                Güncelle
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Security Section - p-4: Mobilde iç boşluğu küçülttük */}
                <section className="bg-zinc-50 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-900">
                            <ShieldCheck size={18} strokeWidth={2.5} />
                            <h3 className="text-sm md:text-base font-bold tracking-tight">Hesap Güvenliği</h3>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-zinc-600 font-medium">
                            Şifrenizi güncelleyerek hesabınızı koruma altında tutun.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="w-full md:w-auto bg-white border border-zinc-200 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-black hover:text-black transition-all text-zinc-800 shadow-sm"
                    >
                        Şifreyi Değiştir
                    </button>
                </section>
            </div>

            <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
        </div>
    );
}