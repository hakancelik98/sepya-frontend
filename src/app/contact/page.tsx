"use client";
import { useSettings } from "@/contexts/SettingsContext";
import { motion } from "framer-motion";

export default function ContactPage() {
    const { settings } = useSettings();

    const whatsappLink = settings?.contactPhone
        ? `https://wa.me/${settings.contactPhone.replace(/\D/g, '')}`
        : "#";

    return (
        <div className="min-h-screen bg-white text-black antialiased selection:bg-black selection:text-white">
            {/* Üst Bölüm: Sadece Marka Adı */}
            <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-xl md:text-2xl font-light uppercase tracking-[0.4em] text-black">
                        {settings?.siteName || "SEPYA"}
                    </h1>
                </motion.div>
            </div>

            {/* Orta Bölüm: Temiz Bilgi Paneli */}
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 border-t border-gray-100">

                {/* İletişim */}
                <div className="py-16 md:border-r border-gray-100 md:pr-10 space-y-12">
                    <section>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 block mb-6">İletişim</span>
                        <div className="flex flex-col gap-3">
                            <a href={`tel:${settings?.contactPhone}`} className="text-sm font-medium tracking-widest hover:text-gray-400 transition-colors">
                                {settings?.contactPhone || "+90 000 000 00 00"}
                            </a>
                            <a href={whatsappLink} target="_blank" className="text-[10px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 w-fit hover:border-black transition-all">
                                WhatsApp
                            </a>
                        </div>
                    </section>

                    <section>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 block mb-6">E-Posta</span>
                        <a href={`mailto:${settings?.contactEmail}`} className="text-sm font-medium tracking-widest hover:text-gray-400 transition-colors">
                            {settings?.contactEmail || "destek@sepya.com"}
                        </a>
                    </section>
                </div>

                {/* Bilgi */}
                <div className="py-16 md:border-r border-gray-100 md:px-10 space-y-12">
                    <section>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 block mb-6">Adres</span>
                        <p className="text-[11px] font-medium leading-relaxed uppercase tracking-[0.15em] text-gray-600 max-w-[250px]">
                            {settings?.contactAddress || "Valikonağı Caddesi, Nişantaşı, İstanbul"}
                        </p>
                    </section>

                    <section>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 block mb-6">Çalışma Saatleri</span>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                            {settings?.businessHours || "Pzt - Cmt / 10:00 - 19:00"}
                        </p>
                    </section>
                </div>

                {/* Sosyal Medya */}
                <div className="py-16 md:pl-10">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 block mb-6">Sosyal Medya</span>
                    <div className="flex flex-col gap-4">
                        <a
                            href="https://instagram.com/sepya"
                            target="_blank"
                            className="text-[11px] font-black uppercase tracking-[0.4em] hover:opacity-40 transition-opacity"
                        >
                            Instagram — @{settings?.siteName?.toLowerCase() || "sepya"}
                        </a>
                    </div>
                </div>
            </div>

            {/* Alt Çizgi */}
            <div className="border-t border-gray-100 w-full" />
        </div>
    );
}