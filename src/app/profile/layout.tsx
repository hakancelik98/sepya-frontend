"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {User, Package, MapPin, LogOut, Heart} from "lucide-react";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [userName, setUserName] = useState("Kullanıcı");
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchUserName = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/";
                return;
            }
            try {
                const response = await fetch(`${BASE_URL}/users/profile`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserName(`${data.firstName} ${data.lastName}`);
                    localStorage.setItem("user", JSON.stringify(data));
                }
            } catch (error) {
                console.error("Hata:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserName();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const menuItems = [
        { name: "Profil", fullName: "Profil Bilgileri", href: "/profile", icon: User },
        { name: "Siparişler", fullName: "Siparişlerim", href: "/profile/orders", icon: Package },
        { name: "Favoriler", fullName: "Favoriler", href: "/profile/favorite", icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-white pt-6 md:pt-16 pb-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">

                    {/* SOL MENÜ / MOBİL ÜST MENÜ */}
                    <aside className="w-full lg:w-64 space-y-4 md:space-y-8">
                        <div className="text-left">
                            <h2 className="text-lg md:text-xl font-light uppercase tracking-widest text-black italic">Hesabım</h2>
                            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-bold">
                                {loading ? "Yükleniyor..." : `Hoş geldiniz, ${userName}`}
                            </p>
                        </div>

                        <nav className="flex flex-row lg:flex-col items-stretch gap-1 border-b lg:border-none pb-2 lg:pb-0">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href}
                                          className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 px-1 lg:px-4 py-3 text-[9px] lg:text-[11px] font-bold uppercase tracking-widest transition-all flex-1 lg:flex-none ${
                                              isActive
                                                  ? "text-black border-b-2 lg:border-b-0 lg:border-l-2 border-black bg-zinc-50 lg:bg-[#F8F5F2]"
                                                  : "text-gray-400 hover:text-black hover:bg-zinc-50"
                                          }`}
                                    >
                                        <Icon size={18} />
                                        <span className="hidden lg:inline">{item.fullName}</span>
                                        <span className="lg:hidden">{item.name}</span>
                                    </Link>
                                );
                            })}

                            <button
                                onClick={handleLogout}
                                className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 px-1 lg:px-4 py-3 text-[9px] lg:text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all flex-1 lg:flex-none lg:mt-4"
                            >
                                <LogOut size={18} />
                                <span>Çıkış</span>
                            </button>
                        </nav>
                    </aside>

                    {/* SAĞ İÇERİK */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}