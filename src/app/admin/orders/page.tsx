"use client";
import { useState, useEffect } from "react";
import OrderFilterBar from "@/app/admin/orders/_components/OrderFilterBar";
import OrderTable from "@/app/admin/orders/_components/OrderTable";
import OrderDetailPage from "@/app/admin/orders/_components/OrderDetailPage";
import { orderService } from "@/app/admin/orders/_services/orderService";
import { Order, OrderStatus, OrderStats as Stats, OrderDetail, OrderFilters } from "@/app/admin/orders/_types/order.types";
import OrderStats from "@/app/admin/orders/_components/OrderStats";
import { Loader2, RefreshCw, Package, ShoppingBag } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export default function AdminPage() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        preparing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        todayOrders: 0,
        todayRevenue: 0,
        weekRevenue: 0,
        monthRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
    const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
    const [currentFilters, setCurrentFilters] = useState<OrderFilters>({});
    const [showDetailView, setShowDetailView] = useState(false);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [ordersData, statsData] = await Promise.all([
                orderService.getAllOrders(currentFilters),
                orderService.getStats(),
            ]);
            const normalizedOrders = ordersData.map((order: any) => ({
                ...order,
                status: normalizeStatus(order.status),
            }));
            setAllOrders(normalizedOrders);
            setFilteredOrders(normalizedOrders);
            setStats(statsData);
        } catch (error: any) {
            console.error("Veri yükleme hatası:", error);
            setError(error.message || "Veriler yüklenemedi");
            toast.error("Veriler yüklenirken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const normalizeStatus = (backendStatus: string): OrderStatus => {
        const statusMap: Record<string, OrderStatus> = {
            "PENDING_PAYMENT": OrderStatus.PENDING,
            "PAYMENT_FAILED": OrderStatus.CANCELLED,
            "PAID": OrderStatus.PREPARING,
            "PENDING": OrderStatus.PENDING,
            "PREPARING": OrderStatus.PREPARING,
            "SHIPPED": OrderStatus.SHIPPED,
            "DELIVERED": OrderStatus.DELIVERED,
            "CANCELLED": OrderStatus.CANCELLED,
        };
        return statusMap[backendStatus] || OrderStatus.PENDING;
    };

    const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
        if (newStatus === OrderStatus.CANCELLED) {
            if (!confirm("Bu siparişi iptal etmek istediğinizden emin misiniz?")) {
                return;
            }
        }

        try {
            const loadingToast = toast.loading("Durum güncelleniyor...");
            await orderService.updateStatus(orderId, newStatus);
            toast.dismiss(loadingToast);
            toast.success("Sipariş durumu güncellendi");
            await fetchData();

            if (selectedOrder?.id === orderId) {
                const updatedDetail = await orderService.getOrderDetail(orderId);
                setSelectedOrder({
                    ...updatedDetail,
                    status: normalizeStatus(updatedDetail.status),
                });
            }
        } catch (error) {
            console.error("Durum güncellenirken hata:", error);
            toast.error("Durum güncellenemedi");
            throw error;
        }
    };

    const handleBulkStatusUpdate = async (status: OrderStatus) => {
        if (selectedOrderIds.length === 0) {
            toast.error("Lütfen sipariş seçin");
            return;
        }

        if (!confirm(`${selectedOrderIds.length} siparişin durumunu güncellemek istediğinizden emin misiniz?`)) {
            return;
        }

        try {
            const loadingToast = toast.loading("Toplu güncelleme yapılıyor...");
            await orderService.bulkUpdateStatus(selectedOrderIds, status);
            toast.dismiss(loadingToast);
            toast.success(`${selectedOrderIds.length} sipariş güncellendi`);
            setSelectedOrderIds([]);
            await fetchData();
        } catch (error) {
            toast.error("Toplu güncelleme başarısız");
        }
    };

    const handleViewDetail = async (orderId: number) => {
        try {
            const detail = await orderService.getOrderDetail(orderId);
            setSelectedOrder({
                ...detail,
                status: normalizeStatus(detail.status),
            });
            setShowDetailView(true);
        } catch (error) {
            console.error("Detay yüklenemedi:", error);
            toast.error("Sipariş detayı yüklenemedi");
        }
    };

    const handleBackToList = () => {
        setShowDetailView(false);
        setSelectedOrder(null);
    };

    const handleSearch = (query: string) => {
        const q = query.toLowerCase().trim();
        setCurrentFilters({ ...currentFilters, search: q });

        if (!q) {
            setFilteredOrders(allOrders);
            return;
        }
        setFilteredOrders(
            allOrders.filter((order) => {
                const orderNumber = order.orderNumber?.toLowerCase() || "";
                const firstName = order.customer?.firstName?.toLowerCase() || "";
                const lastName = order.customer?.lastName?.toLowerCase() || "";
                const email = order.customer?.email?.toLowerCase() || "";
                const fullName = `${firstName} ${lastName}`;
                return (
                    orderNumber.includes(q) ||
                    fullName.includes(q) ||
                    email.includes(q) ||
                    order.id.toString().includes(q)
                );
            })
        );
    };

    const handleStatusFilter = (status: string) => {
        const newFilters = { ...currentFilters, status: status === "ALL" ? undefined : status as OrderStatus };
        setCurrentFilters(newFilters);

        if (status === "ALL") {
            setFilteredOrders(allOrders);
        } else {
            setFilteredOrders(allOrders.filter((o) => o.status === status));
        }
    };

    const handleDateFilter = (startDate: string, endDate: string) => {
        setCurrentFilters({ ...currentFilters, startDate, endDate });
        fetchData();
    };

    const handleSelectOrder = (orderId: number) => {
        setSelectedOrderIds(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrderIds.length === filteredOrders.length) {
            setSelectedOrderIds([]);
        } else {
            setSelectedOrderIds(filteredOrders.map(o => o.id));
        }
    };

    // Show detail view
    if (showDetailView && selectedOrder) {
        return (
            <>
                <Toaster position="top-right" />
                <OrderDetailPage
                    order={selectedOrder}
                    onBack={handleBackToList}
                    onStatusUpdate={handleStatusUpdate}
                    onRefresh={fetchData}
                />
            </>
        );
    }

    if (loading && allOrders.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">
                        Sipariş Verileri Hazırlanıyor...
                    </p>
                </div>
            </div>
        );
    }

    if (error && allOrders.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-white p-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-10 max-w-md w-full shadow-sm text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package size={24} className="text-red-500" />
                    </div>
                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-wider mb-2">Hata Oluştu</p>
                    <p className="text-[10px] text-slate-500 mb-6 font-medium">{error}</p>
                    <button
                        onClick={fetchData}
                        className="w-full bg-black text-white px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="h-screen flex flex-col bg-white overflow-hidden">
                {/* Üst Başlık & Özet */}
                <header className="px-2 py-2 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="text-blue-500" size={18} />
                            </div>
                            <h1 className="font-semibold text-sm tracking-tight text-slate-700">Sipariş Yönetimi</h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-10">
                            Envanter & Operasyon • <span className="text-slate-900">{stats.total} Sipariş</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <span className="text-xl text-slate-900 block leading-tight font-mono">
                                {stats.todayOrders}
                            </span>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Bugünkü Sipariş</p>
                        </div>
                        <div className="w-px h-10 bg-slate-100" />
                        <div className="text-right">
                            <span className="text-xl  text-emerald-700 block leading-tight font-mono">
                                {stats.todayRevenue.toLocaleString("tr-TR")} ₺
                            </span>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Bugünkü Ciro</p>
                        </div>
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="ml-4 p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </header>

                {/* İstatistikler */}
                <div className="px-6 py-4 bg-slate-50/30 border-b border-slate-100">
                    <OrderStats stats={stats} />
                </div>

                {/* Filtre */}
                <OrderFilterBar
                    onSearch={handleSearch}
                    onStatusFilter={handleStatusFilter}
                    onDateFilter={handleDateFilter}
                />

                {/* Toplu İşlemler Çubuğu */}
                {selectedOrderIds.length > 0 && (
                    <div className="px-6 py-3 bg-blue-50 border-y border-blue-100 flex items-center justify-between">
                        <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider">
                            {selectedOrderIds.length} sipariş seçildi
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleBulkStatusUpdate(OrderStatus.PREPARING)}
                                className="px-5 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                            >
                                Hazırlanıyor Yap
                            </button>
                            <button
                                onClick={() => handleBulkStatusUpdate(OrderStatus.SHIPPED)}
                                className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                            >
                                Kargoya Ver
                            </button>
                            <button
                                onClick={() => setSelectedOrderIds([])}
                                className="px-5 py-2 bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-300 transition-all"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-auto bg-white">
                    {filteredOrders.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <Package className="w-10 h-10 text-slate-300" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Sipariş Bulunamadı</p>
                            <p className="text-[10px] mt-2 text-slate-300 font-medium">Filtreleri sıfırlayıp tekrar deneyin.</p>
                        </div>
                    ) : (
                        <OrderTable
                            orders={filteredOrders}
                            selectedOrderIds={selectedOrderIds}
                            onSelectOrder={handleSelectOrder}
                            onSelectAll={handleSelectAll}
                            onStatusUpdate={handleStatusUpdate}
                            onViewDetail={handleViewDetail}
                        />
                    )}
                </main>
            </div>
        </>
    );
}