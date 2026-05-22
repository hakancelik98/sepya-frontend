"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialView?: "login" | "register";
};

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
    const [view, setView] = useState<"login" | "register">(initialView);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { syncGuestCartToBackend } = useCart();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: ""
    });

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setError("");
            setFormData({ firstName: "", lastName: "", email: "", password: "", phone: "" });
        }
    }, [isOpen, initialView]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = view === "login" ? "/api/auth/login" : "/api/auth/register";

        try {
            const API_BASE = process.env.NEXT_PUBLIC_ASSET_URL ?? "";

            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const contentType = response.headers.get("content-type");
            let data;

            try {
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    const textData = await response.text();
                    data = { message: textData };
                }
            } catch (parseError) {
                console.error("Response parse hatası:", parseError);
                data = { message: "Sunucu yanıtı işlenemedi" };
            }

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                try {
                    await syncGuestCartToBackend();
                } catch (syncError) {
                    console.error("⚠️ Sepet senkronizasyonu başarısız:", syncError);
                }

                onClose();
                window.location.reload();
            } else {
                let errorMessage = "İşlem başarısız.";

                // ✅ Backend'den gelen "Beklenmeyen bir hata oluştu" mesajını kontrol et
                if (response.status === 500) {
                    // Eğer login sırasında 500 geliyorsa, büyük ihtimalle credential hatası
                    if (view === "login") {
                        errorMessage = "E-posta veya şifre hatalı";
                    } else {
                        errorMessage = "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.";
                    }
                } else if (response.status === 401 || response.status === 400) {
                    errorMessage = "E-posta veya şifre hatalı";
                } else if (response.status === 409) {
                    errorMessage = data.message || "Bu e-posta adresi zaten kayıtlı";
                } else {
                    errorMessage = data.message || data.error || "Bilinmeyen bir hata oluştu";
                }

                setError(errorMessage);
            }
        } catch (err) {
            console.error("Auth hatası:", err);
            setError("Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[150] p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white shadow-2xl w-full max-w-[850px] min-h-[550px] flex overflow-hidden z-50 rounded-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* SOL TARAF: Görsel */}
                <div className="w-1/2 relative hidden md:block overflow-hidden bg-zinc-100">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={view === "login" ? "/login-side.jpg" : "/register-side.jpg"}
                                alt="Sepya Auth"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/5" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* SAĞ TARAF: Form Alanı */}
                <div className="flex flex-col w-full md:w-1/2 p-10 md:p-14 justify-center relative bg-white">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
                    >
                        <span className="text-2xl font-light text-black">✕</span>
                    </button>

                    <AnimatePresence mode="wait">
                        {view === "login" ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-black tracking-tighter uppercase">Giriş Yap</h2>
                                    <p className="text-gray-500 text-[13px] mt-2 font-medium uppercase tracking-wider">
                                        Hoş geldiniz, bilgilerinizi giriniz.
                                    </p>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-lg text-center border border-red-200"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="E-posta"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
                                    />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="Şifre"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
                                    />
                                    <button
                                        disabled={loading}
                                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-400"
                                    >
                                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                                    </button>
                                </form>

                                <p className="text-[13px] text-gray-500 text-center font-bold">
                                    Hesabın yok mu?
                                    <button
                                        onClick={() => setView("register")}
                                        className="text-black border-b border-black pb-0.5 ml-1"
                                    >
                                        Kayıt Ol
                                    </button>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-black tracking-tighter uppercase">Kayıt Ol</h2>
                                    <p className="text-gray-500 text-[13px] mt-2 font-medium uppercase tracking-wider">
                                        Aramıza katılın ve avantajları yakalayın.
                                    </p>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-lg text-center border border-red-200"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="flex gap-4">
                                        <input
                                            name="firstName"
                                            type="text"
                                            placeholder="Ad"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-1/2 border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
                                        />
                                        <input
                                            name="lastName"
                                            type="text"
                                            placeholder="Soyad"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-1/2 border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
                                        />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="E-posta"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
                                    />
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="Telefon Numarası (Örn: 05xx...)"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
                                    />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="Şifre Oluştur"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
                                    />
                                    <button
                                        disabled={loading}
                                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-400"
                                    >
                                        {loading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
                                    </button>
                                </form>

                                <p className="text-[13px] text-gray-500 text-center font-bold">
                                    Zaten üye misin?
                                    <button
                                        onClick={() => setView("login")}
                                        className="text-black border-b border-black pb-0.5 ml-1"
                                    >
                                        Giriş Yap
                                    </button>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}