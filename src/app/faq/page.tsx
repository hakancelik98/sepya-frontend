"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        id: "siparis",
        category: "Sipariş & Gönderim",
        questions: [
            { q: "Siparişim ne zaman kargolanır?", a: "Hafta içi saat 14:00'e kadar verilen siparişler aynı gün, diğer siparişler ise 24 saat içerisinde atölyemizden kargoya teslim edilir." },
            { q: "Kargo takibini nasıl yapabilirim?", a: "Siparişiniz kargoya verildiğinde size bir takip numarası iletilir. Ayrıca profilinizdeki 'Siparişlerim' bölümünden anlık takip yapabilirsiniz." },
            { q: "Uluslararası gönderim yapıyor musunuz?", a: "Evet, DHL Express aracılığıyla tüm dünyaya 3-5 iş günü içerisinde teslimat sağlıyoruz." }
        ]
    },
    {
        id: "iade",
        category: "İade & Değişim",
        questions: [
            { q: "İade sürecini nasıl başlatırım?", a: "Ürünün size ulaşmasından itibaren 14 gün içinde, faturası ve orijinal kutusuyla birlikte 'İade Talebi' oluşturarak süreci başlatabilirsiniz." },
            { q: "İade ücreti ne zaman yansır?", a: "Ürün atölyemize ulaşıp kontrol edildikten sonra 3 iş günü içinde iadeniz onaylanır. Bankanıza bağlı olarak 7-10 gün içinde hesabınıza yansır." },
            { q: "Hangi ürünler iade kapsamı dışındadır?", a: "Kişiye özel üretilen veya kutusu açılmış/kullanılmış aksesuarlar hijyen kuralları gereği iade alınamamaktadır." }
        ]
    },
    {
        id: "bakim",
        category: "Ürün Bakımı & Kalite",
        questions: [
            { q: "İpek ürünlerin bakımı nasıl olmalı?", a: "Sepya ipek eşarplar sadece kuru temizleme için uygundur. Ütüleme işlemi ise çok düşük ısıda ve tersinden yapılmalıdır." },
            { q: "Kumaşlarınızın içeriği nedir?", a: "Koleksiyonlarımızda %100 Bursa İpeği, Saten ve yüksek kalite dokuma kumaşlar kullanılmaktadır. Ürün detaylarında içerik bilgisi mevcuttur." }
        ]
    },
    {
        id: "uyelik",
        category: "Hesap & Üyelik",
        questions: [
            { q: "Üye olmadan alışveriş yapabilir miyim?", a: "Evet, misafir girişi ile alışveriş yapabilirsiniz ancak sipariş takibi ve kampanyalar için üyelik öneriyoruz." },
            { q: "Şifremi unuttum, ne yapmalıyım?", a: "Giriş ekranındaki 'Şifremi Unuttum' linkine tıklayarak kayıtlı e-postanıza yeni şifre oluşturma bağlantısı talep edebilirsiniz." }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggle = (id: string) => setOpenIndex(openIndex === id ? null : id);

    const scrollToCategory = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="min-h-screen bg-white text-black pt-32 pb-24 selection:bg-black selection:text-white">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Header: Küçültülmüş ve Daha Şık */}
                <header className="mb-24 border-b border-gray-100 pb-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 block mb-4">Destek Merkezi</span>
                    <h1 className="text-5xl md:text-6xl font-light uppercase tracking-tighter">
                        SIKÇA SORULAN <span className="font-serif italic text-gray-300">Sorular</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* SOL: Anchor Menü (Sticky) */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-40 space-y-6">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 italic">Konu Başlıkları</p>
                            <nav className="flex flex-col gap-5 items-start">
                                {faqs.map((group) => (
                                    <button
                                        key={group.id}
                                        onClick={() => scrollToCategory(group.id)}
                                        className="text-[11px] font-black uppercase tracking-[0.3em] hover:text-[#8C7B65] transition-all duration-300 border-b border-transparent hover:border-[#8C7B65] pb-1"
                                    >
                                        {group.category}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* SAĞ: Soru Grupları */}
                    <main className="lg:col-span-9 space-y-32">
                        {faqs.map((group, groupIdx) => (
                            <section key={group.id} id={group.id} className="scroll-mt-40">
                                <h3 className="text-xs font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                                    <span className="w-8 h-[1px] bg-black"></span>
                                    {group.category}
                                </h3>

                                <div className="divide-y divide-gray-100 border-t border-gray-100">
                                    {group.questions.map((item, qIdx) => {
                                        const id = `${groupIdx}-${qIdx}`;
                                        const isOpen = openIndex === id;

                                        return (
                                            <div key={id} className="py-10">
                                                <button
                                                    onClick={() => toggle(id)}
                                                    className="w-full flex justify-between items-center text-left group"
                                                >
                                                    <span className={`text-xl md:text-2xl font-light tracking-tight transition-all duration-500 ${isOpen ? 'italic pl-4 text-[#8C7B65]' : 'group-hover:pl-2'}`}>
                                                        {item.q}
                                                    </span>
                                                    <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                                                        {isOpen ? <Minus size={18} strokeWidth={1} /> : <Plus size={18} strokeWidth={1} />}
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="pt-8 text-gray-500 font-medium leading-relaxed max-w-[700px] text-lg tracking-tight">
                                                                {item.a}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </main>
                </div>
            </div>
        </div>
    );
}