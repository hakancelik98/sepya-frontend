"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import HeaderPopup from "./HeaderPopup";
import AuthModal from "./AuthModal";
import AnnouncementBar from "./AnnouncementBar";
import { Montserrat } from "next/font/google";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";

const brandFont = Montserrat({ subsets: ["latin"], weight: ["300"] });

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [shrink, setShrink] = useState(false);

    // ── AuthContext'ten kullanıcıyı oku (localStorage yerine) ─────────────────
    const { user, isAuthenticated, isAuthModalOpen, authModalView, openAuthModal, closeAuthModal } = useAuth();
    const { itemCount, openCart } = useCart();
    const { settings } = useSettings();

    const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL;

    useEffect(() => {
        const handleScroll = () => setShrink(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className="fixed top-0 left-0 w-full z-50 flex flex-col"
                style={{ willChange: "transform" }}
            >
                <AnimatePresence mode="wait">
                    {!shrink && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden hidden md:block"
                        >
                            <AnnouncementBar />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    className={`w-full flex items-center justify-between px-8 transition-all duration-300 ease-in-out
                    ${shrink ? "h-[55px] bg-white/95 backdrop-blur-md shadow-sm" : "h-[85px] bg-white"}`}
                >
                    {/* Sol */}
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="hover:opacity-60 transition p-1"
                            aria-label="Menu aç"
                        >
                            <Image src="/menu.png" alt="" width={20} height={20} />
                        </button>

                        {settings?.contactPhone && (
                            <a
                                href={`https://wa.me/${settings.contactPhone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-60 transition p-1"
                                aria-label="WhatsApp ile iletişime geç"
                            >
                                <Image src="/whatsapp.png" alt="" width={28} height={28} />
                            </a>
                        )}
                    </div>

                    {/* Orta */}
                    <div className="flex-[2] md:flex-1 flex justify-center items-center min-w-0">
                        <Link href="/" className="flex items-center justify-center">
                            {!shrink && settings?.logoUrl ? (
                                <div className="relative h-[80px] w-[80px] flex-shrink-0">
                                    <Image
                                        src={
                                            settings.logoUrl.startsWith("http")
                                                ? settings.logoUrl
                                                : `${ASSET_BASE}${settings.logoUrl}`
                                        }
                                        alt={settings?.siteName || "Logo"}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            ) : (
                                <span
                                    className={`${brandFont.className} text-lg md:text-xl font-light uppercase text-black tracking-[0.2em] whitespace-nowrap`}
                                >
                                    {settings?.siteName || "Sepya Eşarp"}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Sağ */}
                    <div className="flex items-center gap-6 flex-1 justify-end">
                        <div className="flex items-center gap-2">
                            {isAuthenticated && user ? (
                                // ✅ Giriş yapılmış: profile linki
                                <Link href="/profile" className="flex items-center gap-2 group p-1">
                                    <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-black border-b border-transparent group-hover:border-black transition-all">
                                        {user.firstName}
                                    </span>
                                    <Image
                                        src="/user.png"
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="hover:opacity-60 transition"
                                    />
                                </Link>
                            ) : (
                                // ✅ Giriş yapılmamış: login modal aç
                                <button
                                    onClick={() => openAuthModal("login")}
                                    className="hover:opacity-60 transition p-1"
                                    aria-label="Giriş yap"
                                >
                                    <Image src="/user.png" alt="" width={20} height={20} />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={openCart}
                            className="relative group hover:opacity-60 transition p-1"
                            aria-label={`Sepeti aç (${itemCount} ürün)`}
                        >
                            <Image src="/market.png" alt="" width={20} height={20} />
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white font-bold"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {menuOpen && <HeaderPopup onClose={() => setMenuOpen(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {isAuthModalOpen && (
                    <AuthModal
                        isOpen={isAuthModalOpen}
                        onClose={closeAuthModal}
                        initialView={authModalView}
                    />
                )}
            </AnimatePresence>
        </>
    );
}