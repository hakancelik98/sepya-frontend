"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package, MapPin, CreditCard, Truck, Download,
    ArrowLeft, Clock, CheckCircle2, XCircle,
    AlertCircle, ChevronRight, Calendar, Hash, Info, User
} from "lucide-react";

/* ================= TYPES ================= */

interface OrderListItem {
    id: number;
    orderNumber: string;
    status: string;
    totalPrice: number;
    createdAt: string;
}

interface OrderItem {
    id: number;
    product: { id: number; name: string; imageUrl: string; };
    quantity: number;
    priceAtPurchase: number;
    subtotal: number;
}

interface OrderDetail extends OrderListItem {
    orderItems?: OrderItem[];
    shippingAddress?: { fullName: string; phone: string; addressLine: string; city: string; district: string; };
    trackingNumber?: string;
    invoicePath?: string;
    provider?: string;
    shippingRule?: { trackingUrlTemplate: string; };
}

/* ================= STATUS CONFIG ================= */

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    PENDING_PAYMENT: { label: "Ödeme Bekleniyor", icon: Clock, color: "text-zinc-900", bg: "bg-amber-100" },
    PAYMENT_FAILED: { label: "Ödeme Başarısız", icon: XCircle, color: "text-red-900", bg: "bg-red-100" },
    PAID: { label: "Ödeme Alındı", icon: CheckCircle2, color: "text-emerald-900", bg: "bg-emerald-100" },
    PENDING: { label: "Onay Bekliyor", icon: Info, color: "text-zinc-900", bg: "bg-zinc-200" },
    PREPARING: { label: "Hazırlanıyor", icon: Package, color: "text-blue-900", bg: "bg-blue-100" },
    SHIPPED: { label: "Kargoda", icon: Truck, color: "text-indigo-900", bg: "bg-indigo-100" },
    DELIVERED: { label: "Teslim Edildi", icon: CheckCircle2, color: "text-emerald-900", bg: "bg-emerald-100" },
    CANCELLED: { label: "İptal Edildi", icon: XCircle, color: "text-rose-900", bg: "bg-rose-100" },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderListItem[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
    const [view, setView] = useState<"list" | "detail">("list");
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL;

    const fixUrl = (path?: string) => {
        if (!path) return "/placeholder.jpg";
        if (path.startsWith("http")) return path;
        return `${ASSET_URL}${path.startsWith("/") ? path : `/${path}`}`;
    };

    useEffect(() => { fetchOrders(); }, []);

    // Kritik Düzeltme: Görünüm değiştiğinde sayfayı en üste kaydır
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [view]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setOrders(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleSelectOrder = async (orderId: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedOrder(data);
                setView("detail");
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    if (loading && view === "list") return (
        <div className="flex h-96 items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="border-2 border-zinc-300 border-t-zinc-900 w-6 h-6 rounded-full" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 min-h-[70vh]">
            <AnimatePresence mode="wait">
                {view === "list" ? (
                    /* ================= LİSTE ================= */
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Siparişlerim</h1>
                            <p className="text-sm text-zinc-600">Toplam {orders.length} siparişiniz bulunuyor.</p>
                        </div>

                        <div className="space-y-4">
                            {orders.map((order) => {
                                const status = statusConfig[order.status] || { label: "Bilinmiyor", color: "text-zinc-600", bg: "bg-zinc-100" };
                                return (
                                    <button
                                        key={order.id}
                                        onClick={() => handleSelectOrder(order.id)}
                                        className="w-full flex items-center justify-between p-5 bg-white hover:border-zinc-400 transition-all rounded-2xl border border-zinc-200 shadow-sm group"
                                    >
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-12 items-center flex-1">
                                            <div className="text-left">
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Sipariş No</p>
                                                <p className="text-[13px] font-bold text-zinc-900">#{order.orderNumber}</p>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Durum</p>
                                                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${status.bg} ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="hidden sm:block text-left">
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Tarih</p>
                                                <p className="text-[13px] font-semibold text-zinc-700">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <p className="text-sm font-bold text-zinc-900">{order.totalPrice.toLocaleString("tr-TR")} ₺</p>
                                            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    /* ================= DETAY ================= */
                    <motion.div key="detail" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center justify-between mb-10">
                            <button onClick={() => setView("list")} className="flex items-center gap-2 text-zinc-800 hover:bg-zinc-100 py-2 px-4 rounded-xl border border-zinc-200 transition-all shadow-sm">
                                <ArrowLeft size={16} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">Listeye Dön</span>
                            </button>
                            {selectedOrder?.invoicePath && (
                                <a href={`${ASSET_URL}/uploads/invoices/${selectedOrder.invoicePath}`} target="_blank" className="text-zinc-900 flex items-center gap-2 hover:underline">
                                    <Download size={14} /> <span className="text-[11px] font-bold uppercase tracking-wider">Fatura</span>
                                </a>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* SOL TARAF: ÜRÜNLER VE ÖZET */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="bg-zinc-800 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                                    <div className="relative z-10 flex justify-between items-center"> {/* items-end yerine items-center daha az dikey alan kaplar */}
                                        <div>
                                            {/* mb-2 olan boşluğu mb-0.5 yaptık */}
                                            <h2 className="text-lg font-bold tracking-tight mb-0.5 uppercase italic text-zinc-100 md:text-xl">
                                                Sipariş Özeti
                                            </h2>
                                            <div className="flex items-center gap-3"> {/* gap-4'ten gap-3'e düşürüldü */}
                                                <span className="text-[10px] md:text-xs font-medium text-zinc-400">#{selectedOrder?.orderNumber}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-700"></span> {/* nokta boyutu biraz küçültüldü */}
                                                <span className="text-[10px] md:text-xs font-medium text-zinc-400">
                                                    {new Date(selectedOrder?.createdAt || "").toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {/* mb-1 kaldırıldı veya daraltıldı */}
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Toplam</p>
                                            {/* text-3xl yerine text-2xl yapıldı, mobilde daha az yer kaplar */}
                                            <p className="text-xl md:text-2xl font-bold leading-none">
                                                {selectedOrder?.totalPrice.toLocaleString("tr-TR")} ₺
                                            </p>
                                        </div>
                                    </div>
                                    <Hash size={100} className="absolute -bottom-6 -left-6 text-white/5" />
                                </div>

                                <div className="bg-white border border-zinc-200 rounded-[2rem] p-6">
                                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Package size={16} className="text-zinc-400" /> Ürünler ({selectedOrder?.orderItems?.length})
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedOrder?.orderItems?.map((item) => (
                                            <div key={item.id} className="flex gap-5 items-center p-4 rounded-2xl bg-zinc-50 border border-zinc-100 group">
                                                <div className="w-16 h-20 bg-white rounded-xl overflow-hidden relative border border-zinc-200 flex-shrink-0">
                                                    <Image
                                                        src={fixUrl(item.product.imageUrl)}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[13px] font-bold text-zinc-900 mb-1 leading-tight">{item.product.name}</h4>
                                                    <p className="text-[11px] text-zinc-600 font-semibold">{item.quantity} Adet × {item.priceAtPurchase.toLocaleString("tr-TR")} ₺</p>
                                                </div>
                                                <p className="text-sm font-bold text-zinc-900">{item.subtotal.toLocaleString("tr-TR")} ₺</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* SAĞ TARAF: ADRES VE STATÜ */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-zinc-50 border border-zinc-200 rounded-[2rem] p-6">
                                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <MapPin size={14} /> Teslimat Bilgileri
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[11px] text-zinc-400 uppercase font-bold mb-1">Alıcı</p>
                                            <p className="text-[13px] font-bold text-zinc-900">{selectedOrder?.shippingAddress?.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-zinc-400 uppercase font-bold mb-1">Adres</p>
                                            <p className="text-[13px] text-zinc-800 leading-relaxed font-medium">
                                                {selectedOrder?.shippingAddress?.addressLine}
                                                <br />
                                                <span className="font-bold text-zinc-900 italic lowercase">{selectedOrder?.shippingAddress?.district} / {selectedOrder?.shippingAddress?.city}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-zinc-400 uppercase font-bold mb-1">İletişim</p>
                                            <p className="text-[13px] font-bold text-zinc-900">{selectedOrder?.shippingAddress?.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedOrder?.trackingNumber && (
                                    <div className="bg-white border-2 border-zinc-900 rounded-[2rem] p-6 shadow-sm space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Kargo Firması</p>
                                            <div className="flex items-center gap-3">
                                                <Truck size={18} className="text-zinc-900" />
                                                <p className="text-sm font-black text-zinc-900 uppercase">
                                                    {/* Burada siparişle gelen kargo firması adı yer almalı */}
                                                    {selectedOrder?.provider || "Kargo"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-zinc-100">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Takip Numarası</p>
                                            <p className="text-sm font-bold tracking-widest text-zinc-900 mb-3">{selectedOrder.trackingNumber}</p>

                                            <a
                                                href={`${selectedOrder?.shippingRule?.trackingUrlTemplate}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center w-full py-3 bg-zinc-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-zinc-800 transition-all gap-2"
                                            >
                                                Kargom Nerede?
                                                <ChevronRight size={14} />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 rounded-[2rem] border border-zinc-100 bg-white">
                                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                                        <span>Durum</span>
                                        <span className={statusConfig[selectedOrder.status]?.color}>{statusConfig[selectedOrder.status]?.label}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-zinc-900 transition-all duration-1000"
                                            style={{ width: selectedOrder.status === 'DELIVERED' ? '100%' : '50%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}