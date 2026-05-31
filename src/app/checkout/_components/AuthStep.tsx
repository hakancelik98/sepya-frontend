"use client";

import { useState } from "react";
import { ShoppingBag, ChevronRight, Mail, UserCircle2 } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { motion } from "framer-motion";

interface AuthStepProps {
    guestEmail: string;
    setGuestEmail: (email: string) => void;
    onGuestContinue: () => void;
    error: string | null;
}

export default function AuthStep({
                                     guestEmail,
                                     setGuestEmail,
                                     onGuestContinue,
                                     error,
                                 }: AuthStepProps) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <div className="min-h-[80vh] flex items-start md:items-center justify-center px-2 py-16 md:py-8 bg-white relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full"
            >
                {/* Header - Mobilde ultra kompakt */}
                <div className="text-center mb-6 md:mb-12">
                    <motion.div
                        className="w-12 h-12 md:w-20 md:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 shadow-lg"
                    >
                        <ShoppingBag size={20} className="text-white md:hidden" />
                        <ShoppingBag size={32} className="text-white hidden md:block" />
                    </motion.div>
                    <h1 className="text-xl md:text-4xl font-black uppercase tracking-tighter text-zinc-900 mb-1 md:mb-2">
                        Ödeme Süreci
                    </h1>
                    <p className="text-[8px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
                        Bir yöntem seçin
                    </p>
                </div>

                {/* Grid Yapısı */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 items-stretch">

                    {/* Üye Girişi Kartı */}
                    <div className="flex flex-col">
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="group flex-1 w-full bg-black text-white p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] flex flex-col items-start justify-between transition-all duration-500 hover:bg-zinc-800 shadow-lg active:scale-[0.99] text-left"
                        >
                            <div className="w-full">
                                <div className="flex items-center gap-4 mb-6 md:mb-8">
                                    <div className="bg-white/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0">
                                        <UserCircle2 className="text-white w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h3 className="text-[14px] md:text-xl font-black uppercase tracking-wider">Kayıtlı Müşteri</h3>
                                </div>

                                {/* Avantajlar Bölümü */}
                                <div className="space-y-3 md:space-y-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full group-hover:bg-white transition-colors" />
                                        <p className="text-[10px] md:text-xs font-medium text-zinc-400 group-hover:text-zinc-200">Siparişlerinizi kolayca takip edin</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full group-hover:bg-white transition-colors" />
                                        <p className="text-[10px] md:text-xs font-medium text-zinc-400 group-hover:text-zinc-200">Özel indirim ve kampanyalardan faydalanın</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full group-hover:bg-white transition-colors" />
                                        <p className="text-[10px] md:text-xs font-medium text-zinc-400 group-hover:text-zinc-200">Favori ürünlerinizi kaydedin</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-b border-white/20 pb-0.5 w-fit">
                                Giriş Yap <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>

                    {/* Misafir Bölümü */}
                    <div className="bg-zinc-50 border border-zinc-100 rounded-2xl md:rounded-[2.5rem] p-5 md:p-10 flex flex-col justify-center">
                        <div className="mb-4 md:mb-6">
                            <h3 className="text-[12px] md:text-lg font-black uppercase tracking-wider text-zinc-900 mb-1 md:mb-2">Misafir</h3>
                            <p className="text-[10px] md:text-sm text-zinc-500 leading-tight">Üye olmadan devam edin.</p>
                        </div>

                        <div className="space-y-2 md:space-y-3">
                            {/* Zoom Engelleyici Yeni Kapsayıcı ve Input Yapısı */}
                            <div className="relative group w-full bg-white border border-zinc-200 rounded-xl h-[46px] md:h-[54px] flex items-center overflow-hidden focus-within:border-black transition-all">
                                <Mail className="absolute left-3.5 text-zinc-300 group-focus-within:text-black transition-colors z-10" size={14} />
                                <input
                                    type="email"
                                    placeholder="E-POSTA ADRESİNİZ"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value.toLowerCase())}
                                    /*
                                      - text-base (16px) ile mobil cihazların zoom yapması engellendi.
                                      - scale ve width oranlarıyla görsel olarak eski küçük (10px-11px) haline getirildi.
                                      - padding değerleri transform ölçeklemesine göre optimize edildi.
                                    */
                                    className="w-[160%] bg-transparent border-none outline-none text-base font-bold tracking-[0.2em] uppercase text-zinc-900 placeholder:text-zinc-300 transform origin-left scale-[0.625] pl-18 pr-4"
                                />
                            </div>

                            <button
                                onClick={onGuestContinue}
                                className="w-full bg-white border-2 border-zinc-900 text-zinc-900 py-3 md:py-4 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 active:scale-[0.99]"
                            >
                                Devam Et
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-500 text-[8px] md:text-[9px] mt-2 md:mt-4 font-black uppercase text-center tracking-tight">{error}</p>
                        )}
                    </div>
                </div>
            </motion.div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView="login"
            />
        </div>
    );
}