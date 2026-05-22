"use client";

import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    Truck,
    FileText,
    Save,
    Download,
    Copy,
    CheckCircle2,
    User,
    Phone,
    Mail,
    Calendar,
    Tag,
    Receipt,
    Upload,
    CheckCircle,
    XCircle,
    Hash,
    Percent
} from "lucide-react";
import { OrderDetail, OrderStatus } from "../_types/order.types";
import { useEffect, useState } from "react";
import OrderItemsList from "./OrderItemsList";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { orderService } from "../_services/orderService";
import toast from "react-hot-toast";

export default function OrderDetailPage({
                                            order,
                                            onBack,
                                            onStatusUpdate,
                                            onRefresh,
                                        }: {
    order: OrderDetail | null;
    onBack: () => void;
    onStatusUpdate: (id: number, status: OrderStatus) => Promise<void>;
    onRefresh: () => void;
}) {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        if (order) {
            setTrackingNumber(order.trackingNumber || "");
            setAdminNote(order.adminNote || "");
        }
    }, [order]);

    if (!order) return null;

    const handleSaveTracking = async () => {
        if (!trackingNumber.trim()) {
            toast.error("Takip numarası giriniz");
            return;
        }
        setIsSaving(true);
        try {
            await orderService.updateTrackingNumber(order.id, trackingNumber);
            toast.success("Takip numarası kaydedildi");
            onRefresh();
        } catch {
            toast.error("Kaydetme başarısız");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveNote = async () => {
        setIsSaving(true);
        try {
            await orderService.updateAdminNote(order.id, adminNote);
            toast.success("Not kaydedildi");
            onRefresh();
        } catch {
            toast.error("Kaydetme başarısız");
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportPDF = async () => {
        try {
            const t = toast.loading("PDF oluşturuluyor...");
            await orderService.exportOrderPDF(order.id);
            toast.dismiss(t);
            toast.success("PDF indirildi");
        } catch {
            toast.error("PDF oluşturulamadı");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Sadece PDF yüklenebilir");
            return;
        }

        setIsUploading(true);
        const t = toast.loading("Fatura yükleniyor...");
        try {
            await orderService.uploadInvoice(order.id, file);
            toast.success("Fatura yüklendi", { id: t });
            onRefresh();
        } catch {
            toast.error("Yüklenemedi", { id: t });
        } finally {
            setIsUploading(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success("Kopyalandı");
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Backend'den gelen ekstra alanlar için type-safe erişim
    const orderData = order as any;
    const couponCode = orderData.couponCode || null;
    const discountAmount = orderData.discountAmount || 0;
    const shippingFee = orderData.shippingFee || 0;

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* HEADER */}
            <header className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-xs font-bold uppercase tracking-wide">
                            Geri
                        </span>
                    </button>

                    <div className="w-px h-7 bg-slate-300" />

                    <div className="flex items-center gap-2">
                        <Hash size={16} className="text-slate-500" />
                        <span className="text-sm font-bold text-slate-700">
                            {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                            {formatDate(order.createdAt)}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
                >
                    <Download size={14} />
                    PDF İndir
                </button>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-[1400px] mx-auto p-5 space-y-4">

                    {/* ÜST SATIR - STATUS & PAYMENT & CUSTOMER BİRLEŞİK */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Sol: Sipariş & Ödeme Bilgileri */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Package size={13} className="text-slate-400" />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Sipariş & Ödeme Durumu
                                </h4>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[9px] text-slate-400 mb-1 uppercase tracking-wide">Sipariş Durumu</p>
                                    <OrderStatusBadge status={order.status} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 mb-1 uppercase tracking-wide">Ödeme Durumu</p>
                                    <PaymentStatusBadge status={order.paymentStatus} />
                                </div>
                                <div className="pt-2 border-t border-slate-100">
                                    <p className="text-[9px] text-slate-400 mb-1 uppercase tracking-wide">Toplam Tutar</p>
                                    <p className="text-2xl font-black text-slate-900">
                                        {order.totalPrice.toLocaleString("tr-TR")} ₺
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Orta: Müşteri Bilgileri */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <User size={13} className="text-slate-400" />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Müşteri Bilgileri
                                </h4>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-[9px] text-slate-400 mb-1 uppercase tracking-wide">Ad Soyad</p>
                                    <p className="font-bold text-sm text-slate-900">
                                        {order.customer?.firstName ?? "Misafir"} {order.customer?.lastName ?? ""}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 mb-1 uppercase tracking-wide">E-posta</p>
                                    <div className="flex items-center gap-2">
                                        <Mail size={11} className="text-slate-400" />
                                        <span className="text-xs text-slate-600 truncate flex-1">
                                            {order.customer?.email}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(order.customer.email, "email")}
                                            className="p-1 hover:bg-slate-100 rounded"
                                        >
                                            {copiedField === "email" ? (
                                                <CheckCircle size={11} className="text-green-500" />
                                            ) : (
                                                <Copy size={11} className="text-slate-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sağ: Kupon Kodu */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Tag size={13} className="text-slate-400" />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Kupon & İndirim
                                </h4>
                            </div>
                            {couponCode ? (
                                <div className="space-y-2">
                                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Percent size={14} className="text-emerald-600" />
                                            <span className="text-sm font-black text-emerald-900 tracking-wider">
                                                {couponCode}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(couponCode, "coupon")}
                                                className="ml-auto p-1 hover:bg-emerald-100 rounded"
                                            >
                                                {copiedField === "coupon" ? (
                                                    <CheckCircle size={11} className="text-emerald-600" />
                                                ) : (
                                                    <Copy size={11} className="text-emerald-600" />
                                                )}
                                            </button>
                                        </div>
                                        {discountAmount > 0 && (
                                            <p className="text-xs font-semibold text-emerald-700">
                                                -{discountAmount.toLocaleString("tr-TR")} ₺ indirim uygulandı
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <XCircle size={20} className="text-slate-300 mx-auto mb-2" />
                                    <p className="text-xs text-slate-400 font-medium">
                                        Kupon kodu kullanılmadı
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ADRES & FİYAT DETAY */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Teslimat Adresi */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin size={13} className="text-slate-400" />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Teslimat Adresi
                                </h4>
                            </div>
                            <div className="space-y-2">
                                <p className="font-bold text-sm text-slate-900">{order.shippingAddress.fullName}</p>
                                <p className="text-xs text-slate-600">{order.shippingAddress.addressLine}</p>
                                <p className="text-xs text-slate-600">
                                    {order.shippingAddress.district} / {order.shippingAddress.city}
                                </p>
                                {order.shippingAddress.postalCode && (
                                    <p className="text-xs text-slate-500">
                                        Posta Kodu: {order.shippingAddress.postalCode}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                    <Phone size={11} className="text-slate-400" />
                                    <span className="text-xs text-slate-600">{order.shippingAddress.phone}</span>
                                    <button
                                        onClick={() => copyToClipboard(order.shippingAddress.phone, "phone")}
                                        className="ml-auto p-1 hover:bg-slate-100 rounded"
                                    >
                                        {copiedField === "phone" ? (
                                            <CheckCircle size={11} className="text-green-500" />
                                        ) : (
                                            <Copy size={11} className="text-slate-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Fiyat Detayları */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Receipt size={13} className="text-slate-400" />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Fiyat Detayları
                                </h4>
                            </div>
                            <div className="space-y-2.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Ara Toplam</span>
                                    <span className="font-semibold text-slate-900">
                                        {order.totalPrice.toLocaleString("tr-TR")} ₺
                                    </span>
                                </div>
                                {shippingFee > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Kargo Ücreti</span>
                                        <span className="font-semibold text-slate-900">
                                            {shippingFee.toLocaleString("tr-TR")} ₺
                                        </span>
                                    </div>
                                )}
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span className="font-medium">İndirim</span>
                                        <span className="font-semibold">
                                            -{discountAmount.toLocaleString("tr-TR")} ₺
                                        </span>
                                    </div>
                                )}
                                <div className="pt-2.5 border-t-2 border-slate-200 flex justify-between items-center">
                                    <span className="font-bold text-sm text-slate-900 uppercase">Toplam</span>
                                    <span className="text-xl font-black text-slate-900">
                                        {order.totalPrice.toLocaleString("tr-TR")} ₺
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ÜRÜNLER */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Package size={13} className="text-slate-400" />
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Sipariş Kalemleri ({order.orderItems.length} Ürün)
                            </h4>
                        </div>
                        <OrderItemsList items={order.orderItems} />
                    </div>

                    {/* ADMIN İŞLEMLERİ */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Kargo Takip */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Truck size={13} className="text-slate-400" />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Kargo Takip
                                </h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Takip numarası"
                                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        onClick={handleSaveTracking}
                                        disabled={isSaving}
                                        className="px-3 bg-black text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        <Save size={13} />
                                    </button>
                                </div>
                                {order.trackingNumber && (
                                    <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-blue-900">
                                            {order.trackingNumber}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(order.trackingNumber!, "tracking")}
                                            className="p-1 hover:bg-blue-100 rounded"
                                        >
                                            {copiedField === "tracking" ? (
                                                <CheckCircle size={11} className="text-blue-600" />
                                            ) : (
                                                <Copy size={11} className="text-blue-600" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Admin Notu */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText size={13} className="text-slate-400" />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Admin Notu
                                </h4>
                            </div>
                            <div className="space-y-2">
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    rows={3}
                                    placeholder="Not ekleyin..."
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 resize-none"
                                />
                                <button
                                    onClick={handleSaveNote}
                                    disabled={isSaving}
                                    className="w-full px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {isSaving ? "Kaydediliyor..." : "Kaydet"}
                                </button>
                            </div>
                        </div>

                        {/* Fatura */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Receipt size={13} className="text-slate-400" />
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Fatura (PDF)
                                </h4>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                                    <Upload size={13} className="text-slate-400" />
                                    <span className="text-xs font-semibold text-slate-600">
                                        {isUploading ? "Yükleniyor..." : "PDF Yükle"}
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>
                                {order.invoicePath && (
                                    <a
                                        href={order.invoicePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all"
                                    >
                                        <CheckCircle2 size={13} className="text-green-600" />
                                        <span className="text-xs font-semibold text-green-700">
                                            Faturayı Görüntüle
                                        </span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DURUM GÜNCELLEMELERİ */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 size={13} className="text-slate-400" />
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Sipariş Durumunu Güncelle
                            </h4>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            <button
                                onClick={() => onStatusUpdate(order.id, OrderStatus.PENDING)}
                                disabled={order.status === OrderStatus.PENDING}
                                className="px-5 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold uppercase hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Bekliyor
                            </button>
                            <button
                                onClick={() => onStatusUpdate(order.id, OrderStatus.PREPARING)}
                                disabled={order.status === OrderStatus.PREPARING}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Hazırlanıyor
                            </button>
                            <button
                                onClick={() => onStatusUpdate(order.id, OrderStatus.SHIPPED)}
                                disabled={order.status === OrderStatus.SHIPPED}
                                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Kargoda
                            </button>
                            <button
                                onClick={() => onStatusUpdate(order.id, OrderStatus.DELIVERED)}
                                disabled={order.status === OrderStatus.DELIVERED}
                                className="px-5 py-2 bg-green-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Teslim Edildi
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm("Bu siparişi iptal etmek istediğinizden emin misiniz?")) {
                                        onStatusUpdate(order.id, OrderStatus.CANCELLED);
                                    }
                                }}
                                disabled={order.status === OrderStatus.CANCELLED}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                İptal Et
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}