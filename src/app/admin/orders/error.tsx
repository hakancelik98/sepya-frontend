"use client";

import { AlertCircle } from "lucide-react";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    console.error("❌ Orders sayfası hatası:", error);

    return (
        <div className="h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} className="text-red-500" />
                </div>
                <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-3 italic">
                    HATA OLUŞTU
                </h1>
                <p className="text-[11px] text-red-600 font-bold mb-8 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                    {error.message}
                </p>
                <button
                    onClick={reset}
                    className="w-full bg-black text-white px-8 py-4 font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );
}