"use client";
import { Truck, ShieldCheck, Award, RefreshCw } from "lucide-react";

const features = [
    { icon: <Truck size={24} />, title: "Hızlı Teslimat", desc: "24 saat içinde kargo" },
    { icon: <Award size={24} />, title: "Premium Kalite", desc: "%100 İpek ve Pamuk" },
    { icon: <ShieldCheck size={24} />, title: "Güvenli Ödeme", desc: "256-bit SSL koruması" },
    { icon: <RefreshCw size={24} />, title: "Kolay İade", desc: "14 gün içinde değişim" },
];

export default function Features() {
    return (
        <section className="border-y border-gray-100 bg-[#fafafa]">
            <div className="max-w-[1500px] mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <div className="text-gray-400 group-hover:text-black transition-colors duration-500 mb-4">
                                {f.icon}
                            </div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black mb-1">
                                {f.title}
                            </h4>
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}