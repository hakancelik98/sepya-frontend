"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-black pt-32 pb-24">
            <div className="max-w-[1200px] mx-auto px-6">

                {/* Üst Başlık: Sade ve Net */}
                <header className="max-w-[800px] mb-24">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 block mb-6">Biz Kimiz?</span>
                    <h1 className="text-4xl md:text-6xl font-light uppercase tracking-tighter leading-tight">
                        En Özel Parçaların <br />
                        <span className="font-serif italic text-gray-300">Ortak Noktası.</span>
                    </h1>
                </header>

                {/* Ana Hikaye: İki Sütunlu Zarif Yapı */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-gray-100 pt-16">
                    <div className="lg:col-span-5">
                        <p className="text-2xl font-light leading-snug tracking-tight text-black uppercase">
                            Sepya bir üretim atölyesi değil, dünyadaki dikiş ve dokuma ustalığının <span className="italic font-serif">izini süren</span> bir küratörlük projesidir.
                        </p>
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7 space-y-8">
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            Yola çıktığımızda tek bir amacımız vardı: Kalabalık moda dünyasında, gerçekten özel olanı bulup çıkarmak. Kendi üretimimizi yapmak yerine enerjimizi; kumaş kalitesi, desen özgünlüğü ve işçiliğiyle fark yaratan seçkin markaları keşfetmeye adadık.
                        </p>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            Sepya çatısı altında bulacağınız her bir eşarp, onlarca farklı marka ve binlerce seçenek arasından titizlikle süzülerek seçkimize dahil edilmiştir. Bizim görevimiz; en iyi markaların en özel parçalarını, Sepya estetiğiyle size ulaştırmaktır.
                        </p>
                    </div>
                </div>

                {/* Marka Değerleri: Keskin Çizgili Alan */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 border border-black overflow-hidden">
                    {[
                        { t: "Seçki", d: "Sadece kalite standartlarımıza uyan markalarla çalışıyoruz." },
                        { t: "Kontrol", d: "Her ürün, size ulaşmadan önce uzmanlarımızca incelenir." },
                        { t: "Estetik", d: "Trendlerin ötesinde, zamansız tasarımlara odaklanıyoruz." }
                    ].map((item, i) => (
                        <div key={i} className="p-10 border-b md:border-b-0 md:border-r border-black last:border-0 hover:bg-black hover:text-white transition-colors duration-500">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6">{item.t}</h3>
                            <p className="text-sm font-bold uppercase tracking-widest leading-relaxed opacity-70 italic">{item.d}</p>
                        </div>
                    ))}
                </div>

                {/* Alt Mesaj: Davet */}
                <div className="mt-32 pt-20 border-t border-gray-100 flex flex-col md:flex-row justify-between items-end gap-10">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-light uppercase tracking-tighter">
                            Sizin İçin Seçtiğimiz <br /> Arşivi Keşfedin.
                        </h2>
                    </div>
                    <a href="/shop" className="group flex items-center gap-6">
                        <span className="text-[11px] font-black uppercase tracking-[0.5em] border-b-2 border-black pb-2">Koleksiyonlara Git</span>
                        <span className="text-2xl group-hover:translate-x-4 transition-transform duration-500">→</span>
                    </a>
                </div>

            </div>
        </div>
    );
}