"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";

export function PasswordModal({ isOpen, onClose }: any) {
    const [form, setForm] = useState({ current: "", new: "", confirm: "" });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async () => {
        // Frontend validasyonları
        if (!form.current || !form.new || !form.confirm) {
            setError("Tüm alanları doldurunuz");
            return;
        }

        if (form.new !== form.confirm) {
            setError("Yeni şifreler eşleşmiyor");
            return;
        }

        if (form.new.length < 8) {
            setError("Yeni şifre en az 8 karakter olmalıdır");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE}/users/change-password`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    currentPassword: form.current,
                    newPassword: form.new,
                    confirmPassword: form.confirm
                })
            });

            if (response.ok) {
                setSuccess(true);
                setForm({ current: "", new: "", confirm: "" });

                // 2 saniye sonra modal'ı kapat
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                }, 2000);
            } else {
                const errorData = await response.text();

                // Backend'den gelen hata mesajlarını işle
                if (response.status === 400) {
                    if (errorData.includes("Mevcut şifre hatalı")) {
                        setError("Mevcut şifreniz yanlış");
                    } else if (errorData.includes("eşleşmiyor")) {
                        setError("Şifreler eşleşmiyor");
                    } else {
                        setError(errorData || "Şifre değiştirme başarısız");
                    }
                } else if (response.status === 401) {
                    setError("Oturumunuz sonlanmış. Lütfen tekrar giriş yapın.");
                } else {
                    setError("Bir hata oluştu. Lütfen tekrar deneyin.");
                }
            }
        } catch (err) {
            console.error("Şifre değiştirme hatası:", err);
            setError("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm({ current: "", new: "", confirm: "" });
        setError("");
        setSuccess(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10"
                            disabled={loading}
                        >
                            <X size={18} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Lock size={20} className="text-black" />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900">Şifre Güncelle</h2>
                            <p className="text-xs text-zinc-500 mt-1">Güvenliğiniz için yeni bir şifre belirleyin.</p>
                        </div>

                        {/* Başarı Mesajı */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
                            >
                                <CheckCircle className="text-green-600 flex-shrink-0" size={18} />
                                <p className="text-xs font-semibold text-green-800">Şifreniz başarıyla değiştirildi!</p>
                            </motion.div>
                        )}

                        {/* Hata Mesajı */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
                            >
                                <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                                <p className="text-xs font-semibold text-red-800">{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            {[
                                { id: "current", label: "Mevcut Şifre", val: form.current },
                                { id: "new", label: "Yeni Şifre", val: form.new },
                                { id: "confirm", label: "Yeni Şifre (Tekrar)", val: form.confirm }
                            ].map((field) => (
                                <div key={field.id} className="space-y-1.5">
                                    <label className="text-[9px] font-bold uppercase text-zinc-400 tracking-[0.1em] ml-1">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={show[field.id as keyof typeof show] ? "text" : "password"}
                                            value={field.val}
                                            onChange={(e) => setForm({...form, [field.id]: e.target.value})}
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2.5 text-sm font-semibold focus:bg-white focus:border-black outline-none transition-all"
                                            placeholder="••••••••"
                                            disabled={loading || success}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShow({...show, [field.id]: !show[field.id as keyof typeof show]})}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                                            disabled={loading || success}
                                        >
                                            {show[field.id as keyof typeof show] ? <EyeOff size={15}/> : <Eye size={15}/>}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Şifre Gereksinimleri - Kompakt */}
                            <div className="bg-zinc-50 rounded-lg p-3">
                                <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-[0.1em] mb-1.5">
                                    Şifre Gereksinimleri
                                </p>
                                <ul className="text-[10px] text-zinc-600 space-y-0.5">
                                    <li>• En az 8 karakter</li>
                                    <li>• Büyük/küçük harf, rakam ve özel karakter</li>
                                </ul>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading || success}
                                className="w-full bg-black text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Güncelleniyor..." : success ? "Başarılı!" : "Şifreyi Onayla"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}