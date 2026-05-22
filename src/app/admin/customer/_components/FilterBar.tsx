"use client";
import { Search, Filter, SlidersHorizontal, X, Calendar, Shield } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
    onSearch: (val: string) => void;
    onRoleFilter: (role: string) => void;
    onDateFilter: (start: string, end: string) => void;
    onClearFilters: () => void;
    activeFilters: {
        search: string;
        role: string;
        dateRange: { start: string; end: string } | null;
    };
}

export default function FilterBar({
                                      onSearch,
                                      onRoleFilter,
                                      onDateFilter,
                                      onClearFilters,
                                      activeFilters
                                  }: FilterBarProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const hasActiveFilters =
        activeFilters.search ||
        activeFilters.role ||
        activeFilters.dateRange;

    const applyDateFilter = () => {
        if (startDate && endDate) {
            onDateFilter(startDate, endDate);
        }
    };

    return (
        <div className="space-y-3">
            {/* ANA ARAMA VE FİLTRE ÇUBUĞU */}
            <div className="flex items-center gap-3">
                {/* Arama */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                        <Search size={13} />
                    </div>
                    <input
                        type="text"
                        value={activeFilters.search}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="İsim, soyisim veya email ile ara..."
                        className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-[11px] font-bold uppercase tracking-tight outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300"
                    />
                </div>

                {/* Rol Filtresi */}
                <select
                    value={activeFilters.role}
                    onChange={(e) => onRoleFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-tight outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-600"
                >
                    <option value="">Tüm Roller</option>
                    <option value="ROLE_CUSTOMER">Müşteriler</option>
                    <option value="ROLE_ADMIN">Adminler</option>
                </select>

                {/* Gelişmiş Filtre Toggle */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${
                        showAdvanced
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-500'
                    }`}
                >
                    <SlidersHorizontal size={14} />
                    <span>Gelişmiş</span>
                </button>

                {/* Filtreleri Temizle */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[10px] font-black uppercase tracking-tight hover:bg-red-600 hover:text-white transition-all"
                    >
                        <X size={14} />
                        <span>Temizle</span>
                    </button>
                )}
            </div>

            {/* GELİŞMİŞ FİLTRE PANELİ */}
            {showAdvanced && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <Filter size={14} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Gelişmiş Filtreleme</h3>
                    </div>

                    {/* Tarih Aralığı */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wide mb-1.5">
                                Başlangıç Tarihi
                            </label>
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wide mb-1.5">
                                Bitiş Tarihi
                            </label>
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={applyDateFilter}
                                disabled={!startDate || !endDate}
                                className="w-full bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight hover:bg-slate-800 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                <Calendar size={14} className="inline mr-2" />
                                Tarihe Göre Filtrele
                            </button>
                        </div>
                    </div>

                    {/* Aktif Filtre Göstergeleri */}
                    {hasActiveFilters && (
                        <div className="pt-3 border-t border-slate-200">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide mb-2">Aktif Filtreler:</p>
                            <div className="flex flex-wrap gap-2">
                                {activeFilters.search && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-[9px] font-bold uppercase tracking-tight">
                                        Arama: {activeFilters.search}
                                    </span>
                                )}
                                {activeFilters.role && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-[9px] font-bold uppercase tracking-tight">
                                        <Shield size={10} className="inline mr-1" />
                                        {activeFilters.role === 'ROLE_ADMIN' ? 'Admin' : 'Müşteri'}
                                    </span>
                                )}
                                {activeFilters.dateRange && (
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-tight">
                                        <Calendar size={10} className="inline mr-1" />
                                        {new Date(activeFilters.dateRange.start).toLocaleDateString('tr-TR')} -
                                        {new Date(activeFilters.dateRange.end).toLocaleDateString('tr-TR')}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}