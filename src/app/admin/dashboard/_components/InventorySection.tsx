"use client";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";

interface InventorySectionProps {
    data: {
        criticalStockCount: number;
        topProducts: Array<{
            name: string;
            salesCount?: number;
            price: number;
        }>;
    } | null;
}

export default function InventorySection({ data }: InventorySectionProps) {
    if (!data) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
                <p className="text-center text-xs text-slate-400">Veri yükleniyor...</p>
            </div>
        );
    }

    const hasTopProducts = data.topProducts && data.topProducts.length > 0;
    const maxSalesCount = hasTopProducts && data.topProducts[0]?.salesCount
        ? data.topProducts[0].salesCount
        : 1;

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-50 rounded">
                        <Package size={14} className="text-slate-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Envanter Yönetimi</h3>
                </div>
                {data.criticalStockCount > 0 && (
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">
                        <AlertTriangle size={12} />
                        {data.criticalStockCount} Kritik Stok
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="grid grid-cols-4 gap-4">
                    {/* Kritik Stok Durumu */}
                    <div>
                        <h4 className="text-xs font-semibold text-slate-700 mb-3">Stok Durumu</h4>
                        {data.criticalStockCount > 0 ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-bold text-red-900 mb-1">
                                            {data.criticalStockCount}
                                        </p>
                                        <p className="text-xs text-red-700">
                                            Kritik seviyede
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <Package size={16} className="text-emerald-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-emerald-900 mb-1">Stok Normal</p>
                                        <p className="text-xs text-emerald-700">Tüm ürünler yeterli seviyede</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Top Products Table */}
                    <div className="col-span-3">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={14} className="text-slate-500" />
                            <h4 className="text-xs font-semibold text-slate-700">En Çok Satan Ürünler</h4>
                        </div>

                        {hasTopProducts ? (
                            <div className="space-y-2">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-3 px-3 py-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-600">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-6">Ürün Adı</div>
                                    <div className="col-span-2 text-center">Satış</div>
                                    <div className="col-span-3 text-right">Fiyat</div>
                                </div>

                                {/* Product Rows */}
                                {data.topProducts.map((product, index) => {
                                    const salesCount = product.salesCount || 0;

                                    return (
                                        <div
                                            key={index}
                                            className="grid grid-cols-12 gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors items-center"
                                        >
                                            <div className="col-span-1">
                                                <div className={`
                                                    w-6 h-6 flex items-center justify-center rounded text-xs font-bold
                                                    ${index === 0 ? 'bg-amber-100 text-amber-700' : ''}
                                                    ${index === 1 ? 'bg-slate-200 text-slate-700' : ''}
                                                    ${index === 2 ? 'bg-orange-100 text-orange-700' : ''}
                                                    ${index > 2 ? 'bg-slate-100 text-slate-600' : ''}
                                                `}>
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="col-span-6">
                                                <p className="text-xs font-medium text-slate-900 truncate">
                                                    {product.name}
                                                </p>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <span className="text-xs font-semibold text-slate-900">
                                                    {salesCount}
                                                </span>
                                            </div>
                                            <div className="col-span-3 text-right">
                                                <span className="text-xs font-semibold text-slate-900">
                                                    ₺{product.price.toLocaleString('tr-TR')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Performance Chart */}
                                {data.topProducts[0]?.salesCount && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-xs font-semibold text-slate-700 mb-3">Satış Dağılımı</p>
                                        <div className="space-y-2">
                                            {data.topProducts.slice(0, 5).map((product, index) => {
                                                const salesCount = product.salesCount || 0;
                                                const percentage = maxSalesCount > 0
                                                    ? (salesCount / maxSalesCount) * 100
                                                    : 0;

                                                const colors = [
                                                    'bg-amber-500',
                                                    'bg-blue-500',
                                                    'bg-purple-500',
                                                    'bg-emerald-500',
                                                    'bg-pink-500'
                                                ];

                                                return (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <span className="text-xs text-slate-600 w-4">{index + 1}</span>
                                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${colors[index]} rounded-full transition-all`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-semibold text-slate-900 w-12 text-right">
                                                            {salesCount}
                                                        </span>
                                                        <span className="text-xs text-slate-500 w-12 text-right">
                                                            %{percentage.toFixed(0)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <Package size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs">Ürün verisi yok</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}