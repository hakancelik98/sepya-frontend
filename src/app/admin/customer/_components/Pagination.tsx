"use client";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       totalElements,
                                       pageSize,
                                       onPageChange,
                                       onPageSizeChange
                                   }: PaginationProps) {
    const startIndex = currentPage * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalElements);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage < 3) {
                for (let i = 0; i < 4; i++) pages.push(i);
                pages.push(-1); // Ellipsis
                pages.push(totalPages - 1);
            } else if (currentPage > totalPages - 4) {
                pages.push(0);
                pages.push(-1);
                for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
            } else {
                pages.push(0);
                pages.push(-1);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push(-1);
                pages.push(totalPages - 1);
            }
        }

        return pages;
    };

    return (
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            {/* SOL: Gösterilen kayıt bilgisi */}
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                    {startIndex}-{endIndex} / {totalElements} kayıt gösteriliyor
                </span>

                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold uppercase outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                >
                    <option value={10}>10 / Sayfa</option>
                    <option value={25}>25 / Sayfa</option>
                    <option value={50}>50 / Sayfa</option>
                    <option value={100}>100 / Sayfa</option>
                </select>
            </div>

            {/* SAĞ: Sayfa navigasyonu */}
            <div className="flex items-center gap-2">
                {/* İlk sayfaya git */}
                <button
                    onClick={() => onPageChange(0)}
                    disabled={currentPage === 0}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    title="İlk Sayfa"
                >
                    <ChevronsLeft size={16} />
                </button>

                {/* Önceki sayfa */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    title="Önceki Sayfa"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Sayfa numaraları */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => {
                        if (page === -1) {
                            return (
                                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 text-[10px] font-bold">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`min-w-[32px] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {page + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Sonraki sayfa */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    title="Sonraki Sayfa"
                >
                    <ChevronRight size={16} />
                </button>

                {/* Son sayfaya git */}
                <button
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    title="Son Sayfa"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
}