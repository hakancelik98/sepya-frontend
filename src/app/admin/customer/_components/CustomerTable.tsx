"use client";
import {
    Eye, Mail, Calendar, User, MapPin,
    ArrowUpDown, ArrowUp, ArrowDown,
    Shield, Trash2
} from "lucide-react";
import { useState } from "react";

interface CustomerTableProps {
    customers: any[];
    onSort: (field: string) => void;
    sortField: string;
    sortDirection: string;
    onBulkAction: (action: string, ids: number[]) => void;
    onViewDetails: (customer: any) => void;
}

export default function CustomerTable({
                                          customers = [],
                                          onSort,
                                          sortField,
                                          sortDirection,
                                          onBulkAction,
                                          onViewDetails
                                      }: CustomerTableProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const safeCustomers = Array.isArray(customers) ? customers : [];

    const toggleSelection = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelectedIds(
            selectedIds.length === safeCustomers.length
                ? []
                : safeCustomers.map(c => c.id)
        );
    };

    const handleBulkAction = (action: string) => {
        if (selectedIds.length === 0) return;
        onBulkAction(action, selectedIds);
        setSelectedIds([]);
    };

    const SortButton = ({ field, label }: { field: string; label: string }) => (
        <button
            onClick={() => onSort(field)}
            className="flex items-center gap-1.5 group hover:text-blue-600 transition-colors"
        >
            <span>{label}</span>
            {sortField === field ? (
                sortDirection === 'asc' ? (
                    <ArrowUp size={12} className="text-blue-600" />
                ) : (
                    <ArrowDown size={12} className="text-blue-600" />
                )
            ) : (
                <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
            )}
        </button>
    );

    if (safeCustomers.length === 0) {
        return (
            <div className="w-full p-20 text-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    Henüz müşteri kaydı yok
                </p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-3">
            {/* TOPLU İŞLEM PANELİ */}
            {selectedIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            {selectedIds.length} Müşteri Seçildi
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleBulkAction('makeAdmin')}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-tight hover:bg-slate-800 transition-all flex items-center gap-1.5"
                        >
                            <Shield size={12} />
                            Admin Yap
                        </button>
                        <button
                            onClick={() => handleBulkAction('makeCustomer')}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-tight hover:border-slate-300 transition-all flex items-center gap-1.5"
                        >
                            <User size={12} />
                            Müşteri Yap
                        </button>
                        <button
                            onClick={() => handleBulkAction('delete')}
                            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[9px] font-black uppercase tracking-tight hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5"
                        >
                            <Trash2 size={12} />
                            Sil
                        </button>
                    </div>
                </div>
            )}

            {/* TABLO */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                    <tr className="bg-white border-b border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-[0.1em]">
                        <th className="px-6 py-4 w-12">
                            <input
                                type="checkbox"
                                checked={selectedIds.length === safeCustomers.length && safeCustomers.length > 0}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                        </th>
                        <th className="px-6 py-4 w-[30%]">
                            <SortButton field="firstName" label="Müşteri" />
                        </th>
                        <th className="px-6 py-4 w-[30%]">
                            <SortButton field="email" label="İletişim" />
                        </th>
                        <th className="px-6 py-4 w-[20%]">
                            <SortButton field="createdAt" label="Kayıt Tarihi" />
                        </th>
                        <th className="px-6 py-4 w-[20%] text-right">Eylemler</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {safeCustomers.map((c) => (
                        <tr
                            key={c.id}
                            className={`hover:bg-slate-50/50 transition-colors group ${
                                selectedIds.includes(c.id) ? 'bg-blue-50/30' : ''
                            }`}
                        >
                            <td className="px-6 py-3">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(c.id)}
                                    onChange={() => toggleSelection(c.id)}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                            </td>
                            <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                                        <User size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-bold text-slate-700 leading-tight group-hover:text-blue-600 transition-colors uppercase">
                                            {c.firstName} {c.lastName}
                                        </span>
                                        <span className={`text-[9px] font-bold mt-0.5 px-1.5 py-0.5 rounded w-fit border ${
                                            c.role === 'ROLE_ADMIN'
                                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                : 'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}>
                                            {c.role === 'ROLE_ADMIN' ? 'YÖNETİCİ' : 'ÜYE'}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                                        <Mail size={10} className="text-slate-400" /> {c.email}
                                    </span>
                                    {c.phone && (
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold uppercase tracking-tighter">
                                            <MapPin size={10} /> {c.phone}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Calendar size={11} className="text-slate-400" />
                                    <span className="text-[11px] font-mono font-bold">
                                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('tr-TR') : '-'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <button
                                    onClick={() => onViewDetails(c)}
                                    className="px-3 py-1.5 text-slate-600 hover:text-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 rounded-lg transition-all inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tight"
                                    title="Detayları Görüntüle"
                                >
                                    <Eye size={13} />
                                    DETAY
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}