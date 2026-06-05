"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"validating" | "valid" | "invalid" | "success">("validating");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_ASSET_URL ?? "";

    // Token'ı sayfa yüklendiğinde doğrula
    useEffect(() => {
        if (!token) {
            setStatus("invalid");
            return;
        }

        const validate = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/auth/reset-password/validate?token=${token}`);
                setStatus(res.ok ? "valid" : "invalid");
            } catch {
                setStatus("invalid");
            }
        };

        validate();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Şifreler eşleşmiyor");
            return;
        }
        if (formData.newPassword.length < 8) {
            setError("Şifre en az 8 karakter olmalıdır");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, ...formData })
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setStatus("success");
            } else {
                setError(data.message || "Şifre sıfırlanamadı. Lütfen tekrar deneyin.");
            }
        } catch {
            setError("Sunucuya bağlanılamadı.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10"
            >

                {/* Doğrulanıyor */}
                {status === "validating" && (
                    <div className="text-center space-y-4">
                        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-500 text-sm font-medium">Bağlantı doğrulanıyor...</p>
                    </div>
                )}

                {/* Geçersiz token */}
                {status === "invalid" && (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-black tracking-tighter uppercase">Geçersiz Bağlantı</h1>
                            <p className="text-gray-500 text-sm mt-2">
                                Bu şifre sıfırlama bağlantısı kullanılmış veya süresi dolmuş.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="block w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all text-center shadow-xl"
                        >
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                )}

                {/* Şifre formu */}
                {status === "valid" && (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-black text-black tracking-tighter uppercase">Yeni Şifre</h1>
                            <p className="text-gray-500 text-[13px] mt-2 font-medium uppercase tracking-wider">
                                Güçlü bir şifre belirleyin.
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
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Yeni Şifre"
                                    required
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-3 text-gray-400 hover:text-black transition-colors"
                                >
                                    {showPassword
                                        ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Şifreyi Tekrar Girin"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-medium"
                            />

                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Şifre en az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir.
                            </p>

                            <button
                                disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-400"
                            >
                                {loading ? "Kaydediliyor..." : "Şifremi Güncelle"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Başarılı */}
                {status === "success" && (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-black tracking-tighter uppercase">Şifre Güncellendi</h1>
                            <p className="text-gray-500 text-sm mt-2">
                                Şifreniz başarıyla değiştirildi. Artık yeni şifrenizle giriş yapabilirsiniz.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="block w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all text-center shadow-xl"
                        >
                            Giriş Yap
                        </Link>
                    </div>
                )}

            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}