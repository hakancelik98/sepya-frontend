"use client";

interface CashOnDeliveryPaymentProps {
    serviceFee?: number;
}

export default function CashOnDeliveryPayment({ serviceFee = 0 }: CashOnDeliveryPaymentProps) {
    return (
        <div className="py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center animate-in zoom-in-95 duration-300">
            {/* İkon boyutu ve alt boşluğu küçültüldü */}
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm mb-3">
                <span className="text-2xl">🚚</span>
            </div>

            <h3 className="text-[12px] text-gray-900 font-black uppercase tracking-widest mb-1.5">
                Kapıda Ödeme
            </h3>

            <p className="text-[10px] text-gray-500 px-6 leading-tight mb-4">
                Ödemenizi teslimat anında nakit veya kartla yapabilirsiniz.
            </p>

            {serviceFee > 0 && (
                <div className="mt-2 pt-3 border-t border-gray-100 mx-6">
                    <div className="bg-amber-50 rounded-lg py-2 px-3 border border-amber-100">
                        <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight">
                            Ek Hizmet Bedeli: {serviceFee.toFixed(2)} ₺
                        </p>
                    </div>
                </div>
            )}

            {/* Bilgi listesi daha kompakt hale getirildi */}
            <div className="mt-4 space-y-1.5 px-6 inline-block text-left">
                <div className="flex items-center gap-2">
                    <span className="text-green-600 text-[10px]">✓</span>
                    <p className="text-[10px] text-gray-600 font-medium">Nakit veya Kartla Ödeme</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-green-600 text-[10px]">✓</span>
                    <p className="text-[10px] text-gray-600 font-medium">Teslimatta Güvenli Ödeme</p>
                </div>
            </div>
        </div>
    );
}