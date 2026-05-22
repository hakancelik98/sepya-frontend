"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    ShieldAlert,
    Mail,
    Calendar,
    User,
    ChevronRight,
    Activity,
    Phone,
    Loader2,
    Shield,
    Trash2
} from "lucide-react";
import { customerService } from "@/app/admin/customer/_services/customerService";
import RoleUpdateModal from "@/app/admin/customer/_components/CustomerDetailModal";
import { ToastContainer } from "@/app/admin/customer/_components/Toast";

export default function CustomerDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>>([]);

    useEffect(() => {
        fetchCustomerDetail();
    }, [id]);

    const fetchCustomerDetail = async () => {
        try {
            setLoading(true);
            const data = await customerService.getCustomerById(id as string);
            setCustomer(data);
        } catch (error) {
            console.error("Müşteri detayı yüklenemedi:", error);
            showToast("Müşteri bilgileri yüklenirken hata oluştu", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleRoleUpdate = async (newRole: string) => {
        try {
            await customerService.updateRole(customer.id.toString(), newRole);
            showToast("Rol başarıyla güncellendi", "success");
            setShowRoleModal(false);
            fetchCustomerDetail();
        } catch (error) {
            showToast("Rol güncellenirken hata oluştu", "error");
        }
    };

    const handleDeleteCustomer = async () => {
        if (!confirm(`${customer.firstName} ${customer.lastName} adlı müşteriyi silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            await customerService.deleteCustomer(customer.id.toString());
            showToast("Müşteri başarıyla silindi", "success");
            setTimeout(() => router.push('/admin/customer'), 1500);
        } catch (error: any) {
            showToast(error.message || "Müşteri silinirken hata oluştu", "error");
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-slate-300" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri bulunamadı</p>
                    <button
                        onClick={() => router.push('/admin/customer')}
                        className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                    >
                        Listeye Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto p-6 space-y-6">
            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Role Modal */}
            <RoleUpdateModal
                isOpen={showRoleModal}
                onClose={() => setShowRoleModal(false)}
                customer={customer}
                onUpdate={handleRoleUpdate}
            />

            {/* ÜST NAVİGASYON & BAŞLIK */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => router.push('/admin/customer')}
                    className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors w-fit group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Müşteri Listesine Dön</span>
                </button>

                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-stone-900 text-white rounded-2xl flex items-center justify-center text-xl font-black">
                            {customer.firstName?.[0]}{customer.lastName?.[0]}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                {customer.firstName} {customer.lastName}
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Müşteri Detay Profili</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border ${
                            customer.role === 'ROLE_ADMIN'
                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                            {customer.role === 'ROLE_ADMIN' ? 'Yönetici' : 'Aktif Üye'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* SOL: Müşteri Bilgi Kartı */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-3">İletişim & Kimlik</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Mail size={14}/></div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">E-Posta Adresi</p>
                                    <p className="text-xs font-bold text-gray-900">{customer.email}</p>
                                </div>
                            </div>

                            {customer.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Phone size={14}/></div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Telefon</p>
                                        <p className="text-xs font-bold text-gray-900">{customer.phone}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Calendar size={14}/></div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Üyelik Tarihi</p>
                                    <p className="text-xs font-bold text-gray-900">
                                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : '-'}
                                    </p>
                                </div>
                            </div>

                            {customer.lastLogin && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Activity size={14}/></div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Son Giriş</p>
                                        <p className="text-xs font-bold text-gray-900">
                                            {new Date(customer.lastLogin).toLocaleDateString('tr-TR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {customer.birthDate && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><User size={14}/></div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Doğum Tarihi</p>
                                        <p className="text-xs font-bold text-gray-900">
                                            {new Date(customer.birthDate).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* İstatistik Kartı */}
                    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-3 mb-4">
                            Hesap Detayları
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">Müşteri ID</span>
                                <span className="text-xs font-black text-slate-700 font-mono">#{customer.id}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">Hesap Durumu</span>
                                <span className="text-xs font-black text-emerald-600">Aktif</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAĞ: Aksiyonlar */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Bilgi Kartı */}
                    <div className="bg-blue-50 border border-blue-100 rounded-[24px] p-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Activity size={16} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Müşteri Profil Yönetimi</h4>
                                <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                                    Bu sayfadan müşteri bilgilerini görüntüleyebilir, rol değişiklikleri yapabilir ve hesap yönetimi işlemlerini gerçekleştirebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Aksiyon Paneli */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Rol Yönetimi */}
                        <div className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-stone-900 font-black text-[10px] uppercase">
                                <Shield size={14} /> Rol Yönetimi
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">
                                Kullanıcı yetkilerini düzenleyin
                            </p>
                            <button
                                onClick={() => setShowRoleModal(true)}
                                className="w-full py-3 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
                            >
                                Rol Değiştir
                            </button>
                        </div>

                        {/* Hesap Yönetimi */}
                        <div className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase">
                                <ShieldAlert size={14} /> Hesap Yönetimi
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">
                                Müşteri hesabını kalıcı olarak silin
                            </p>
                            <button
                                onClick={handleDeleteCustomer}
                                className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
                            >
                                <Trash2 size={12} className="inline mr-2" />
                                Hesabı Sil
                            </button>
                        </div>
                    </div>

                    {/* Aktivite Özeti */}
                    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Aktivite Özeti</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-slate-50 rounded-xl">
                                <p className="text-2xl font-black text-slate-800 font-mono">0</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Toplam Sipariş</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-xl">
                                <p className="text-2xl font-black text-slate-800 font-mono">0₺</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Toplam Harcama</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-xl">
                                <p className="text-2xl font-black text-emerald-600 font-mono">100%</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Başarı Oranı</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}