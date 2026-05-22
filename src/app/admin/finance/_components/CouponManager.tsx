"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Copy, Tag, Gift, Zap, Users, Star } from "lucide-react";
import CreateCouponModal from "./CreateCouponModal";
import { financeService } from "../_services/financeService";

// Backend'den gelen veriye göre ikon eşleştirmesi yapan yardımcı fonksiyon
const getCouponIcon = (type: string, firstOrderOnly: boolean) => {
    if (firstOrderOnly) return Gift;
    if (type === 'PERCENTAGE') return Star;
    return Zap;
};

export default function CouponManager() {
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any | null>(null); // ✅ Düzenleme state'i
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Verileri Backend'den Çek
    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const data = await financeService.getCoupons();
            setCoupons(data);
        } catch (error) {
            console.error("Kuponlar yüklenirken hata oluştu:", error);
            alert("Kupon listesi alınamadı!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // 2. Kopyalama Fonksiyonu
    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Kupon kodu kopyalandı: ${code}`);
    };

    // 3. Silme İşlemi (Backend Entegrasyonlu)
    const handleDelete = async (id: number) => {
        if (confirm('Bu kuponu silmek istediğinize emin misiniz?')) {
            try {
                await financeService.deleteCoupon(id);
                setCoupons(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                alert("Kupon silinirken bir hata oluştu.");
            }
        }
    };

    // 4. Aktif/Pasif Yapma (Backend Entegrasyonlu)
    const handleToggleActive = async (coupon: any) => {
        try {
            const updatedCoupon = { ...coupon, active: !coupon.active };
            await financeService.updateCoupon(coupon.id, updatedCoupon);

            setCoupons(prev => prev.map(c =>
                c.id === coupon.id ? { ...c, active: !c.active } : c
            ));
        } catch (error) {
            alert("Durum güncellenirken hata oluştu.");
        }
    };

    // ✅ 5. Düzenleme Fonksiyonu (YENİ)
    const handleEdit = (coupon: any) => {
        setEditingCoupon(coupon);
        setShowModal(true);
    };

    // ✅ 6. Modal Kapanma Handler (YENİ)
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCoupon(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl space-y-6">
            {/* Header Bölümü */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase">Kupon Kodları</h2>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Veritabanından canlı kupon yönetimi</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                    <Plus size={14} />
                    Yeni Kupon
                </button>
            </div>

            {/* İstatistikler (Dinamik) */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Toplam Kupon</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{coupons.length}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Aktif</p>
                    <p className="text-2xl font-black text-emerald-700 mt-1">{coupons.filter(c => c.active).length}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-wider">Kullanılan</p>
                    <p className="text-2xl font-black text-blue-700 mt-1">
                        {coupons.reduce((acc, curr) => acc + (curr.usageCount || 0), 0)}
                    </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-[9px] font-black text-purple-600 uppercase tracking-wider">Min. Harcama Ort.</p>
                    <p className="text-2xl font-black text-purple-700 mt-1">
                        ₺{coupons.length > 0 ? Math.round(coupons.reduce((acc, curr) => acc + (curr.minPurchaseAmount || 0), 0) / coupons.length) : 0}
                    </p>
                </div>
            </div>

            {/* Kupon Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((coupon) => {
                    const Icon = getCouponIcon(coupon.discountType, coupon.firstOrderOnly);
                    // ✅ Null check eklendi
                    const usageCount = coupon.usageCount || 0;
                    const usageLimit = coupon.usageLimit || 1;
                    const usageRate = Math.min((usageCount / usageLimit) * 100, 100); // Max %100

                    return (
                        <div key={coupon.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-xl hover:border-slate-300 transition-all group relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-5">
                                <Icon size={80} />
                            </div>

                            <div className="relative">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="px-2 py-1 bg-slate-900 text-white rounded font-mono text-sm font-black flex items-center gap-1">
                                                <Tag size={12} />
                                                {coupon.code}
                                            </div>
                                            <button onClick={() => handleCopyCode(coupon.code)} className="p-1 hover:bg-slate-100 rounded transition-all">
                                                <Copy size={12} className="text-slate-400" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {coupon.firstOrderOnly && (
                                                <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-[8px] font-black uppercase flex items-center gap-1">
                                                    <Gift size={10} /> İlk Sipariş
                                                </span>
                                            )}
                                            {coupon.requiresLogin && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8px] font-black uppercase flex items-center gap-1">
                                                    <Users size={10} /> Giriş Gerekli
                                                </span>
                                            )}
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8px] font-black uppercase">
                                                {coupon.discountType}
                                            </span>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={coupon.active}
                                            onChange={() => handleToggleActive(coupon)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                    </label>
                                </div>

                                <div className="mb-4">
                                    <p className="text-3xl font-black text-slate-900">
                                        {coupon.discountType === 'PERCENTAGE' ? `%${coupon.discountAmount}` : `₺${coupon.discountAmount}`}
                                        <span className="text-[10px] text-slate-400 font-medium ml-1">İNDİRİM</span>
                                    </p>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-slate-500 font-medium">Min. Sepet:</span>
                                        <span className="font-bold text-slate-900">₺{coupon.minPurchaseAmount || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-slate-500 font-medium">Kullanım:</span>
                                        <span className="font-bold text-slate-900">{usageCount} / {usageLimit}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-slate-500 font-medium">Bitiş:</span>
                                        <span className="font-bold text-slate-900">{new Date(coupon.endDate).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>

                                {/* Kullanım Barı */}
                                <div className="mb-4">
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${usageRate > 80 ? 'bg-red-500' : usageRate > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${usageRate}%` }}
                                        />
                                    </div>
                                    {/* ✅ Yüzde göstergesi eklendi */}
                                    <p className="text-[9px] text-slate-400 font-bold mt-1 text-right">
                                        %{usageRate.toFixed(0)} Kullanıldı
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {/* ✅ Düzenle butonuna onClick handler eklendi */}
                                    <button
                                        onClick={() => handleEdit(coupon)}
                                        className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1"
                                    >
                                        <Edit2 size={12} /> Düzenle
                                    </button>
                                    <button onClick={() => handleDelete(coupon.id)} className="px-3 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg transition-all">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ✅ Modal'a editingCoupon prop'u eklendi */}
            {showModal && <CreateCouponModal
                coupon={editingCoupon} // Düzenleme modunda mevcut kupon
                onClose={handleCloseModal}
                onSuccess={fetchCoupons}
            />}
        </div>
    );
}