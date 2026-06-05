"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialView?: "login" | "register";
};

type View = "login" | "register" | "forgot" | "forgot-sent";

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
    const [view, setView] = useState<View>(initialView);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { syncGuestCartToBackend } = useCart();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: ""
    });

    const [forgotEmail, setForgotEmail] = useState("");

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setError("");
            setFormData({ firstName: "", lastName: "", email: "", password: "", phone: "" });
            setForgotEmail("");
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
                login(data.token, data.user);

                try {
                    await syncGuestCartToBackend();
                } catch (syncError) {
                    console.error("⚠️ Sepet senkronizasyonu başarısız:", syncError);
                }

                onClose();
                window.location.reload();
            } else {
                let errorMessage = "İşlem başarısız.";

                if (response.status === 500) {
                    errorMessage = view === "login"
                        ? "E-posta veya şifre hatalı"
                        : "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.";
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

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const API_BASE = process.env.NEXT_PUBLIC_ASSET_URL ?? "";

            const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail })
            });

            // Başarılı veya başarısız fark etmez, güvenlik için hep aynı mesajı göster
            setView("forgot-sent");
        } catch (err) {
            console.error("Şifremi unuttum hatası:", err);
            // Yine de "gönderildi" sayfasına geç — sunucu hatalarını kullanıcıya yansıtma
            setView("forgot-sent");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Sol taraf görseli: forgot ekranlarında login görselini kullan
    const sideImage = view === "register" ? "/register-side.jpg" : "/login-side.jpg";

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
                            key={sideImage}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={sideImage}
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

                        {/* ── GİRİŞ YAP ── */}
                        {view === "login" && (
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

                                    {/* Şifremi unuttum linki */}
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => { setError(""); setView("forgot"); }}
                                            className="text-xs text-gray-400 hover:text-black transition-colors font-medium"
                                        >
                                            Şifremi unuttum
                                        </button>
                                    </div>

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
                        )}

                        {/* ── KAYIT OL ── */}
                        {view === "register" && (
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

                        {/* ── ŞİFREMİ UNUTTUM ── */}
                        {view === "forgot" && (
                            <motion.div
                                key="forgot"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-black tracking-tighter uppercase">
                                        Şifremi Unuttum
                                    </h2>
                                    <p className="text-gray-500 text-[13px] mt-2 font-medium uppercase tracking-wider">
                                        E-posta adresinize sıfırlama bağlantısı göndereceğiz.
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

                                <form onSubmit={handleForgotPassword} className="space-y-5">
                                    <input
                                        type="email"
                                        placeholder="E-posta adresiniz"
                                        required
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
                                    />
                                    <button
                                        disabled={loading}
                                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-400"
                                    >
                                        {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                                    </button>
                                </form>

                                <p className="text-[13px] text-gray-500 text-center font-bold">
                                    <button
                                        onClick={() => { setError(""); setView("login"); }}
                                        className="text-black border-b border-black pb-0.5"
                                    >
                                        ← Giriş sayfasına dön
                                    </button>
                                </p>
                            </motion.div>
                        )}

                        {/* ── GÖNDERILDI ONAY EKRANI ── */}
                        {view === "forgot-sent" && (
                            <motion.div
                                key="forgot-sent"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8 text-center"
                            >
                                {/* İkon */}
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-black text-black tracking-tighter uppercase">
                                        Mail Gönderildi
                                    </h2>
                                    <p className="text-gray-500 text-[13px] mt-3 font-medium leading-relaxed">
                                        Eğer <span className="text-black font-bold">{forgotEmail}</span> adresine kayıtlı
                                        bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.
                                    </p>
                                    <p className="text-gray-400 text-[12px] mt-2">
                                        Bağlantı 30 dakika geçerlidir. Gelen kutusu ile spam klasörünüzü kontrol edin.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => { setError(""); setForgotEmail(""); setView("forgot"); }}
                                        className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.15em] hover:border-black hover:text-black transition-all"
                                    >
                                        Tekrar Gönder
                                    </button>
                                    <button
                                        onClick={() => { setError(""); setView("login"); }}
                                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl"
                                    >
                                        Giriş Sayfasına Dön
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}