"use client";
import { X, Info, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { financeService } from "../_services/financeService";

interface CreateCouponModalProps {
    coupon?: any; // ✅ Düzenleme için mevcut kupon (opsiyonel)
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateCouponModal({ coupon, onClose, onSuccess }: CreateCouponModalProps) {
    const [loading, setLoading] = useState(false);
    const isEditMode = !!coupon; // ✅ Düzenleme modu kontrolü

    // ✅ Düzenleme modunda mevcut kupon verilerini doldur
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountAmount: '',
        minPurchaseAmount: '',
        maxDiscountAmount: '',
        usageLimit: '',
        endDate: '',
        firstOrderOnly: false,
        requiresLogin: false, // ✅ YENİ
        active: true
    });

    // ✅ Coupon prop'u değiştiğinde form verilerini güncelle
    useEffect(() => {
        if (coupon) {
            // LocalDateTime'ı date input'una çevir (YYYY-MM-DD formatı)
            const formattedEndDate = coupon.endDate
                ? new Date(coupon.endDate).toISOString().split('T')[0]
                : '';

            setFormData({
                code: coupon.code || '',
                discountType: coupon.discountType || 'PERCENTAGE',
                discountAmount: coupon.discountAmount?.toString() || '',
                minPurchaseAmount: coupon.minPurchaseAmount?.toString() || '',
                maxDiscountAmount: coupon.maxDiscountAmount?.toString() || '',
                usageLimit: coupon.usageLimit?.toString() || '',
                endDate: formattedEndDate,
                firstOrderOnly: coupon.firstOrderOnly || false,
                requiresLogin: coupon.requiresLogin || false, // ✅ YENİ
                active: coupon.active ?? true
            });
        }
    }, [coupon]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                discountAmount: Number(formData.discountAmount),
                minPurchaseAmount: Number(formData.minPurchaseAmount) || 0,
                maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
                usageLimit: Number(formData.usageLimit),
                endDate: new Date(formData.endDate).toISOString()
            };

            if (isEditMode) {
                // ✅ Düzenleme modu
                await financeService.updateCoupon(coupon.id, payload);
                alert('Kupon başarıyla güncellendi! ✅');
            } else {
                // ✅ Yeni oluşturma modu
                await financeService.createCoupon(payload);
                alert('Kupon başarıyla oluşturuldu! 🚀');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Kupon hatası:', error);
            alert(error.response?.data?.message || 'Kupon kaydedilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white p-6 border-b border-slate-200 flex items-center justify-between z-10">
                    <div>
                        {/* ✅ Başlık düzenleme moduna göre değişiyor */}
                        <h2 className="text-xl font-black uppercase">
                            {isEditMode ? 'Kupon Düzenle' : 'Yeni Kupon Oluştur'}
                        </h2>
                        <p className="text-[10px] text-slate-500 font-medium mt-1">
                            {isEditMode ? 'Mevcut kuponu güncelle' : 'Veritabanına yeni indirim kodu ekle'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
                            Temel Bilgiler
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">Kupon Kodu *</label>
                                <input
                                    type="text"
                                    placeholder="YENIYIL25"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono uppercase focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    disabled={isEditMode} // ✅ Düzenleme modunda kod değiştirilemez
                                    required
                                />
                                {isEditMode && (
                                    <p className="text-[9px] text-slate-400 mt-1">Kupon kodu düzenlenemez</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">İndirim Tipi *</label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                >
                                    <option value="PERCENTAGE">Yüzde (%)</option>
                                    <option value="FIXED">Sabit Tutar (₺)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">İndirim Miktarı *</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.discountAmount}
                                        onChange={(e) => setFormData({...formData, discountAmount: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        required
                                    />
                                    <span className="absolute right-3 top-2 text-sm font-bold text-slate-400">
                                        {formData.discountType === 'PERCENTAGE' ? '%' : '₺'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">Kullanım Limiti *</label>
                                <input
                                    type="number"
                                    placeholder="1000"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    required
                                />
                                {/* ✅ Düzenleme modunda mevcut kullanım sayısını göster */}
                                {isEditMode && coupon?.usageCount !== undefined && (
                                    <p className="text-[9px] text-slate-500 mt-1">
                                        Şu ana kadar {coupon.usageCount} kez kullanıldı
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
                            Kullanım Şartları
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">Min. Sepet Tutarı (₺)</label>
                                <input
                                    type="number"
                                    value={formData.minPurchaseAmount}
                                    onChange={(e) => setFormData({...formData, minPurchaseAmount: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">Maks. İndirim (₺)</label>
                                <input
                                    type="number"
                                    placeholder="Sınırsız"
                                    value={formData.maxDiscountAmount}
                                    onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">Bitiş Tarihi *</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-3 p-4 bg-pink-50 border border-pink-200 rounded-lg cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.firstOrderOnly}
                                onChange={(e) => setFormData({...formData, firstOrderOnly: e.target.checked})}
                                className="w-5 h-5 rounded border-pink-300 text-pink-600"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-black text-pink-900">Sadece İlk Sipariş</p>
                                <p className="text-[10px] text-pink-700 font-medium">Bu kod sadece ilk alışverişte geçerli olur.</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.requiresLogin}
                                onChange={(e) => setFormData({...formData, requiresLogin: e.target.checked})}
                                className="w-5 h-5 rounded border-blue-300 text-blue-600"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-black text-blue-900">Giriş Gerekli</p>
                                <p className="text-[10px] text-blue-700 font-medium">Bu kuponu sadece üye olan kullanıcılar kullanabilir.</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-black text-sm uppercase"
                            disabled={loading}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg font-black text-sm uppercase flex items-center justify-center gap-2 shadow-lg"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {/* ✅ Button text düzenleme moduna göre değişiyor */}
                            {loading ? 'Kaydediliyor...' : (isEditMode ? 'Değişiklikleri Kaydet' : 'Kuponu Oluştur')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}