"use client";
import { OrderItem } from "../_types/order.types";
import { ImageIcon } from "lucide-react";

export default function OrderItemsList({ items }: { items: OrderItem[] }) {
    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="p-3">Ürün Bilgisi</th>
                    <th className="p-3 text-center">Adet</th>
                    <th className="p-3 text-right">Birim Fiyat</th>
                    <th className="p-3 text-right">Toplam</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                    <tr key={item.id} className="text-xs hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                                    {item.product.imageUrl ? (
                                        <img
                                            src={item.product.imageUrl}
                                            className="w-full h-full object-cover"
                                            alt={item.product.name}
                                            onError={(e) => {
                                                // Görsel yüklenemezse placeholder göster
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ImageIcon size={18} />
                                        </div>
                                    )}
                                </div>
                                <span className="font-semibold text-slate-900">{item.product.name}</span>
                            </div>
                        </td>
                        <td className="p-3 text-center">
                                <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-3 bg-slate-100 rounded-lg font-bold text-slate-700">
                                    {item.quantity}
                                </span>
                        </td>
                        <td className="p-3 text-right text-slate-600 font-medium font-mono">
                            {item.priceAtPurchase.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900 font-mono">
                            {item.subtotal.toLocaleString('tr-TR')} ₺
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}