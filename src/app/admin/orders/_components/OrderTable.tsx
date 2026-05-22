"use client";
import { Eye, Package, CreditCard, Banknote, Building2 } from "lucide-react";
import { Order, OrderStatus } from "../_types/order.types";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import StatusUpdateDropdown from "./StatusUpdateDropdown";

const PaymentMethodBadge = ({ method }: { method: string }) => {

    if (!method) {
        return (
            <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                Belirtilmemiş
            </span>
        );
    }

    const normalizedMethod = method.toUpperCase();

    switch (method) {
        case "CREDIT_CARD":
            return (
                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 w-fit">
                    <CreditCard size={10} />
                    <span className="text-[9px] font-bold uppercase">Kart</span>
                </div>
            );
        case "COD":
            return (
                <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 w-fit">
                    <Banknote size={10} />
                    <span className="text-[9px] font-bold uppercase">Kapıda</span>
                </div>
            );
        case "BANK_TRANSFER":
            return (
                <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 w-fit">
                    <Building2 size={10} />
                    <span className="text-[9px] font-bold uppercase">Havale</span>
                </div>
            );
        default:
            return <span className="text-[9px] font-bold text-gray-400">{method}</span>;
    }
};

export default function OrderTable({
                                       orders,
                                       selectedOrderIds,
                                       onSelectOrder,
                                       onSelectAll,
                                       onStatusUpdate,
                                       onViewDetail,
                                   }: {
    orders: Order[];
    selectedOrderIds: number[];
    onSelectOrder: (id: number) => void;
    onSelectAll: () => void;
    onStatusUpdate: (id: number, s: OrderStatus) => Promise<void>;
    onViewDetail?: (id: number) => void;
}) {
    const allSelected = orders.length > 0 && selectedOrderIds.length === orders.length;

    return (
        <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse table-auto text-left">
                <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="pl-4 py-4 w-10">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={onSelectAll}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-0"
                        />
                    </th>
                    <th className="px-2 py-4">Sipariş</th>
                    <th className="px-2 py-4">Müşteri</th>
                    <th className="px-2 py-4">Durum</th>
                    <th className="px-2 py-4">Ödeme</th>
                    <th className="px-2 py-4 text-right">Tutar</th>
                    <th className="px-2 py-4 text-center">Ürün</th>
                    <th className="px-2 py-4">Tarih</th>
                    <th className="px-2 py-4 w-40">İşlem</th>
                    <th className="pr-4 py-4 w-10 text-right">Detay</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                    const isSelected = selectedOrderIds.includes(order.id);

                    return (
                        <tr
                            key={order.id}
                            className={`group transition-colors hover:bg-gray-50/80 ${isSelected ? 'bg-zinc-50' : ''}`}
                        >
                            <td className="pl-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onSelectOrder(order.id)}
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-0"
                                />
                            </td>
                            <td className="px-2 py-3" onClick={() => onViewDetail?.(order.id)}>
                                    <span className="text-[10px] font-mono font-bold text-gray-900">
                                        #{order.orderNumber}
                                    </span>
                            </td>
                            <td className="px-2 py-3">
                                <div className="max-w-[120px]">
                                    <p className="text-[11px] font-bold text-gray-900 truncate">
                                        {order.customer.firstName} {order.customer.lastName}
                                    </p>
                                    <p className="text-[9px] text-gray-400 truncate tracking-tight">
                                        {order.customer.email}
                                    </p>
                                </div>
                            </td>
                            <td className="px-2 py-3">
                                <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="px-2 py-3">
                                <div className="flex flex-col gap-1">
                                    <PaymentMethodBadge method={order.paymentMethod} />
                                    <PaymentStatusBadge status={order.paymentStatus} />
                                </div>
                            </td>
                            <td className="px-2 py-3 text-right">
                                    <span className="text-[11px] font-black text-gray-900">
                                        {order.totalPrice.toLocaleString("tr-TR")} ₺
                                    </span>
                            </td>
                            <td className="px-2 py-3 text-center">
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    <Package size={10} />
                                    {order.itemCount}
                                </div>
                            </td>
                            <td className="px-2 py-3">
                                <div className="text-[9px] leading-tight text-gray-500 font-medium">
                                    {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit"
                                    })}
                                    <div className="text-gray-300">{new Date(order.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</div>
                                </div>
                            </td>
                            <td className="px-2 py-3">
                                <StatusUpdateDropdown
                                    currentStatus={order.status}
                                    onUpdate={(s) => onStatusUpdate(order.id, s)}
                                />
                            </td>
                            <td className="pr-4 py-3 text-right">
                                <button
                                    onClick={() => onViewDetail?.(order.id)}
                                    className="p-1.5 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-200 rounded-md transition-all"
                                >
                                    <Eye size={14} />
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}