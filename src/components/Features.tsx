import { Truck, ShieldCheck, Award, RefreshCw } from "lucide-react";

const features = [
    { icon: Truck, title: "Hızlı Teslimat", desc: "24 saat içinde kargo" },
    { icon: Award, title: "Premium Kalite", desc: "%100 İpek ve Pamuk" },
    { icon: ShieldCheck, title: "Güvenli Ödeme", desc: "256-bit SSL koruması" },
    { icon: RefreshCw, title: "Kolay İade", desc: "14 gün içinde değişim" },
];

// FIX: "use client" kaldırıldı — tamamen statik, server component olarak render edilir
// FIX: min-h-[120px] eklendi — CLS (layout shift) önlenir
export default function Features() {
    return (
        <section className="border-y border-gray-100 bg-[#fafafa] min-h-[120px]">
            <div className="max-w-[1500px] mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="text-gray-400 group-hover:text-black transition-colors duration-500 mb-4">
                                    <Icon size={24} aria-hidden="true" />
                                </div>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black mb-1">
                                    {f.title}
                                </h4>
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                                    {f.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}