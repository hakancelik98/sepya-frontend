"use client";
import { X, Mail, Phone, Calendar, Activity, Shield, Trash2, Package, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Order {
    id: number;
    orderNumber: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    items: any[];
}

interface CustomerDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: any;
    onRoleChange: (customerId: number, newRole: string) => void;
    onDelete: (customerId: number) => void;
}

export default function CustomerDetailModal({
                                                isOpen,
                                                onClose,
                                                customer,
                                                onRoleChange,
                                                onDelete
                                            }: CustomerDetailModalProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (isOpen && customer) {
            fetchCustomerOrders();
        }
    }, [isOpen, customer]);

    const fetchCustomerOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/orders/customer/${customer.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Siparişler yüklenemedi:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (newRole: string) => {
        if (confirm(`${customer.firstName} ${customer.lastName} rolünü değiştirmek istiyor musunuz?`)) {
            onRoleChange(customer.id, newRole);
        }
    };

    const handleDelete = () => {
        if (confirm(`${customer.firstName} ${customer.lastName} adlı müşteriyi SİLMEK istediğinize emin misiniz?`)) {
            onDelete(customer.id);
        }
    };

    const getStatusColor = (status: string) => {
        const statusMap: any = {
            'PENDING': 'bg-amber-100 text-amber-700 border-amber-200',
            'CONFIRMED': 'bg-blue-100 text-blue-700 border-blue-200',
            'SHIPPED': 'bg-purple-100 text-purple-700 border-purple-200',
            'DELIVERED': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'CANCELLED': 'bg-red-100 text-red-700 border-red-200'
        };
        return statusMap[status] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getStatusText = (status: string) => {
        const statusTexts: any = {
            'PENDING': 'Beklemede',
            'CONFIRMED': 'Onaylandı',
            'SHIPPED': 'Kargoda',
            'DELIVERED': 'Teslim Edildi',
            'CANCELLED': 'İptal'
        };
        return statusTexts[status] || status;
    };

    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0);
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200"
            >
                {/* HEADER */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-lg font-black border border-white/20">
                            {customer.firstName?.[0]}{customer.lastName?.[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none">
                                {customer.firstName} {customer.lastName}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                                Müşteri #{customer.id}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight border ${
                            customer.role === 'ROLE_ADMIN'
                                ? 'bg-amber-500 text-white border-amber-600'
                                : 'bg-white/10 text-white border-white/20'
                        }`}>
                            {customer.role === 'ROLE_ADMIN' ? 'YÖNETİCİ' : 'MÜŞTERİ'}
                        </span>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* TABS */}
                <div className="border-b border-slate-200 bg-slate-50 px-6">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'info'
                                    ? 'bg-white text-slate-900 border-b-2 border-slate-900'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Bilgiler
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'orders'
                                    ? 'bg-white text-slate-900 border-b-2 border-slate-900'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Siparişler ({orders.length})
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                    {activeTab === 'info' ? (
                        <div className="p-6 space-y-6">
                            {/* İstatistikler */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                                        <Package size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-wider">Toplam Sipariş</span>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 font-mono">{orders.length}</p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                        <CreditCard size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-wider">Toplam Harcama</span>
                                    </div>
                                    <p className="text-2xl font-black text-emerald-700 font-mono">{totalSpent.toLocaleString('tr-TR')}₺</p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                                        <Activity size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-wider">Tamamlanan</span>
                                    </div>
                                    <p className="text-2xl font-black text-blue-700 font-mono">{completedOrders}</p>
                                </div>
                            </div>

                            {/* İletişim Bilgileri */}
                            <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
                                    İletişim Bilgileri
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                            <Mail size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">E-posta</p>
                                            <p className="text-sm font-bold text-slate-900">{customer.email}</p>
                                        </div>
                                    </div>
                                    {customer.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                <Phone size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Telefon</p>
                                                <p className="text-sm font-bold text-slate-900">{customer.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                            <Calendar size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Üyelik Tarihi</p>
                                            <p className="text-sm font-bold text-slate-900">
                                                {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('tr-TR', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                }) : '-'}
                                            </p>
                                        </div>
                                    </div>
                                    {customer.lastLogin && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                <Activity size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Son Giriş</p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {new Date(customer.lastLogin).toLocaleDateString('tr-TR', {
                                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Aksiyonlar */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleRoleChange(customer.role === 'ROLE_ADMIN' ? 'ROLE_CUSTOMER' : 'ROLE_ADMIN')}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                                >
                                    <Shield size={14} />
                                    {customer.role === 'ROLE_ADMIN' ? 'Müşteri Yap' : 'Admin Yap'}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <Trash2 size={14} />
                                    Hesabı Sil
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6">
                            {loading ? (
                                <div className="py-20 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-900"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Yükleniyor...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="py-20 text-center">
                                    <Package size={40} className="mx-auto text-slate-300 mb-4" strokeWidth={1} />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Henüz sipariş yok
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                        <Package size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                                            #{order.orderNumber}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 font-medium">
                                                            {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-slate-900 font-mono">
                                                        {(order.totalPrice ?? 0).toLocaleString('tr-TR')}₺
                                                    </p>
                                                    <span className={`inline-block px-2 py-1 rounded text-[8px] font-black uppercase border ${getStatusColor(order.status)}`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                            </div>
                                            {order.items && order.items.length > 0 && (
                                                <div className="pt-3 border-t border-slate-100">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Ürünler:</p>
                                                    <div className="space-y-1">
                                                        {order.items.map((item: any, idx: number) => (
                                                            <p key={idx} className="text-[10px] text-slate-600">
                                                                • {item.productName} <span className="text-slate-400">x{item.quantity}</span>
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}