"use client";

import { useState, useEffect } from "react";
import FilterBar from "./_components/FilterBar";
import CustomerTable from "./_components/CustomerTable";
import CustomerStats from "./_components/CustomerStats";
import Pagination from "./_components/Pagination";
import CustomerDetailModal from "./_components/CustomerDetailModal";
import { ToastContainer } from "./_components/Toast";
import { customerService } from "./_services/customerService";
import { Loader2, RefreshCw, Download, Shield } from "lucide-react";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [sortField, setSortField] = useState("createdAt");
    const [sortDirection, setSortDirection] = useState("desc");

    const [filters, setFilters] = useState({
        search: "",
        role: "",
        dateRange: null as { start: string; end: string } | null
    });

    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>>([]);

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, pageSize, sortField, sortDirection, filters]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            let response;

            if (filters.search) {
                response = await customerService.searchCustomers(
                    filters.search, currentPage, pageSize, sortField, sortDirection
                );
            } else if (filters.role) {
                response = await customerService.getCustomersByRole(
                    filters.role, currentPage, pageSize, sortField, sortDirection
                );
            } else if (filters.dateRange) {
                response = await customerService.getCustomersByDateRange(
                    filters.dateRange.start,
                    filters.dateRange.end,
                    currentPage, pageSize, sortField, sortDirection
                );
            } else {
                response = await customerService.getAllCustomers(
                    currentPage, pageSize, sortField, sortDirection
                );
            }

            if (response && response.content) {
                setCustomers(response.content);
                setTotalPages(response.totalPages || 0);
                setTotalElements(response.totalElements || 0);
            } else {
                setCustomers(Array.isArray(response) ? response : []);
                setTotalPages(1);
                setTotalElements(Array.isArray(response) ? response.length : 0);
            }
        } catch (error: any) {
            console.error("Müşteri verisi çekilemedi:", error);
            showToast(error.message || "Müşteriler yüklenirken hata oluştu", "error");
            setCustomers([]);
            setTotalPages(0);
            setTotalElements(0);
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

    const handleSearch = (query: string) => {
        setFilters(prev => ({ ...prev, search: query }));
        setCurrentPage(0);
    };

    const handleRoleFilter = (role: string) => {
        setFilters(prev => ({ ...prev, role }));
        setCurrentPage(0);
    };

    const handleDateFilter = (start: string, end: string) => {
        setFilters(prev => ({ ...prev, dateRange: { start, end } }));
        setCurrentPage(0);
    };

    const handleClearFilters = () => {
        setFilters({ search: "", role: "", dateRange: null });
        setCurrentPage(0);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleViewDetails = (customer: any) => {
        setSelectedCustomer(customer);
        setShowDetailModal(true);
    };

    const handleRoleChange = async (customerId: number, newRole: string) => {
        try {
            await customerService.updateRole(customerId.toString(), newRole);
            showToast("Rol başarıyla güncellendi", "success");
            setShowDetailModal(false);
            fetchCustomers();
        } catch (error) {
            showToast("Rol güncellenirken hata oluştu", "error");
        }
    };

    const handleDelete = async (customerId: number) => {
        try {
            await customerService.deleteCustomer(customerId.toString());
            showToast("Müşteri başarıyla silindi", "success");
            setShowDetailModal(false);
            fetchCustomers();
        } catch (error: any) {
            showToast(error.message || "Müşteri silinirken hata oluştu", "error");
        }
    };

    const handleBulkAction = async (action: string, ids: number[]) => {
        try {
            if (action === 'makeAdmin') {
                await customerService.bulkUpdateRole(ids, 'ROLE_ADMIN');
                showToast(`${ids.length} müşteri admin yapıldı`, "success");
            } else if (action === 'makeCustomer') {
                await customerService.bulkUpdateRole(ids, 'ROLE_CUSTOMER');
                showToast(`${ids.length} kullanıcı müşteri yapıldı`, "success");
            } else if (action === 'delete') {
                if (confirm(`${ids.length} müşteriyi silmek istediğinize emin misiniz?`)) {
                    await customerService.bulkDeleteCustomers(ids);
                    showToast(`${ids.length} müşteri silindi`, "success");
                }
            }
            fetchCustomers();
        } catch (error) {
            showToast("Toplu işlem başarısız oldu", "error");
        }
    };

    const handleExport = async () => {
        try {
            showToast("Dışa aktarma başlatılıyor...", "info");
            const allCustomers = await customerService.getAllCustomersWithoutPagination();

            const headers = ["ID", "Ad", "Soyad", "Email", "Telefon", "Rol", "Kayıt Tarihi"];
            const rows = allCustomers.map((c: any) => [
                c.id,
                c.firstName,
                c.lastName,
                c.email,
                c.phone || '-',
                c.role === 'ROLE_ADMIN' ? 'Admin' : 'Müşteri',
                c.createdAt ? new Date(c.createdAt).toLocaleDateString('tr-TR') : '-'
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map((row: any) => row.join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `musteriler_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();

            showToast("Müşteri listesi başarıyla dışa aktarıldı", "success");
        } catch (error) {
            showToast("Dışa aktarma başarısız oldu", "error");
        }
    };

    if (loading && customers.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-slate-300" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            <CustomerDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedCustomer(null);
                }}
                customer={selectedCustomer}
                onRoleChange={handleRoleChange}
                onDelete={handleDelete}
            />

            {/* HEADER */}
            <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-end bg-white shrink-0">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-none">
                        Müşteri Yönetimi
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
                        Müşteri listesi ve detaylı bilgiler
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <span className="text-xl font-black text-slate-900 block leading-none font-mono">
                            {totalElements}
                        </span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-wider">Toplam Kayıt</p>
                    </div>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-tight hover:bg-emerald-600 hover:text-white transition-all"
                    >
                        <Download size={14} />
                        <span>Dışa Aktar</span>
                    </button>

                    <button
                        onClick={fetchCustomers}
                        disabled={loading}
                        className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            {/* STATS */}
            <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 shrink-0">
                <CustomerStats />
            </div>

            {/* FILTERS */}
            <div className="px-8 py-3 border-b border-slate-100 bg-white shrink-0">
                <FilterBar
                    onSearch={handleSearch}
                    onRoleFilter={handleRoleFilter}
                    onDateFilter={handleDateFilter}
                    onClearFilters={handleClearFilters}
                    activeFilters={filters}
                />
            </div>

            {/* TABLE */}
            <main className="flex-1 overflow-auto bg-white">
                {customers.length === 0 && !loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                        <Shield size={40} strokeWidth={1} className="mb-4 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                            Eşleşen Kayıt Bulunamadı
                        </p>
                    </div>
                ) : (
                    <CustomerTable
                        customers={customers}
                        onSort={handleSort}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onBulkAction={handleBulkAction}
                        onViewDetails={handleViewDetails}
                    />
                )}
            </main>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setCurrentPage(0);
                    }}
                />
            )}
        </div>
    );
}