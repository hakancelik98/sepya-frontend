"use client";
import { Search, Calendar, X } from "lucide-react";
import { OrderStatus } from "../_types/order.types";
import { useState } from "react";

export default function OrderFilterBar({
                                           onSearch,
                                           onStatusFilter,
                                           onDateFilter,
                                       }: {
    onSearch: (val: string) => void;
    onStatusFilter: (status: string) => void;
    onDateFilter: (startDate: string, endDate: string) => void;
}) {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleApplyDateFilter = () => {
        if (startDate && endDate) {
            onDateFilter(startDate, endDate);
            setShowDatePicker(false);
        }
    };

    const handleClearDateFilter = () => {
        setStartDate("");
        setEndDate("");
        onDateFilter("", "");
        setShowDatePicker(false);
    };

    const getQuickDateRange = (type: 'today' | 'week' | 'month') => {
        const today = new Date();
        const end = today.toISOString().split('T')[0];
        let start = "";

        switch(type) {
            case 'today':
                start = end;
                break;
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                start = weekAgo.toISOString().split('T')[0];
                break;
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                start = monthAgo.toISOString().split('T')[0];
                break;
        }

        setStartDate(start);
        setEndDate(end);
        onDateFilter(start, end);
        setShowDatePicker(false);
    };

    return (
        <div className="px-6 py-3 bg-slate-50/30 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96 transition-all">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-blue-500' : 'text-slate-400'}`} size={13} />
                <input
                    type="text"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Sipariş no, müşteri adı veya e-posta ara..."
                    className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-[11px] focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Durum Filtresi */}
                <div className="relative flex-1 md:flex-none md:w-48">
                    <select
                        onChange={(e) => onStatusFilter(e.target.value)}
                        className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-[10px] font-bold text-slate-600 appearance-none cursor-pointer hover:border-slate-300 transition-all outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 uppercase tracking-wider"
                    >
                        <option value="ALL">TÜM DURUMLAR</option>
                        <option value={OrderStatus.PENDING}>⏱ BEKLEMEDE</option>
                        <option value={OrderStatus.PREPARING}>📦 HAZIRLANIYOR</option>
                        <option value={OrderStatus.SHIPPED}>🚚 KARGODA</option>
                        <option value={OrderStatus.DELIVERED}>✅ TESLİM EDİLDİ</option>
                        <option value={OrderStatus.CANCELLED}>❌ İPTAL</option>
                    </select>
                </div>

                {/* Tarih Filtresi */}
                <div className="relative">
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            startDate && endDate
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                        <Calendar size={14} />
                        {startDate && endDate ? 'Tarih Seçili' : 'Tarih Filtrele'}
                        {startDate && endDate && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClearDateFilter();
                                }}
                                className="ml-1 hover:bg-blue-700 rounded-full p-0.5 transition-all"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </button>

                    {showDatePicker && (
                        <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-6 z-50 min-w-[320px]">
                            <div className="space-y-4">
                                <div className="flex gap-2 pb-4 border-b border-slate-100">
                                    <button
                                        onClick={() => getQuickDateRange('today')}
                                        className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-black text-slate-700 transition-all uppercase tracking-wider"
                                    >
                                        Bugün
                                    </button>
                                    <button
                                        onClick={() => getQuickDateRange('week')}
                                        className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-black text-slate-700 transition-all uppercase tracking-wider"
                                    >
                                        Son 7 Gün
                                    </button>
                                    <button
                                        onClick={() => getQuickDateRange('month')}
                                        className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-black text-slate-700 transition-all uppercase tracking-wider"
                                    >
                                        Son 30 Gün
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">
                                            Başlangıç Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">
                                            Bitiş Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={handleApplyDateFilter}
                                        disabled={!startDate || !endDate}
                                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        Uygula
                                    </button>
                                    <button
                                        onClick={handleClearDateFilter}
                                        className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                                    >
                                        Temizle
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}