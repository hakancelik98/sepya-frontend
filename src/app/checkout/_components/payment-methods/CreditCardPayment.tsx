"use client";

// usePaymentForm burada KULLANILMIYOR.
// Tüm state ve handler'lar PaymentForm.tsx'ten prop olarak geliyor.

interface CardFormState {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    saveCard?: boolean;
}

interface CreditCardPaymentProps {
    formData: CardFormState;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isValid: boolean;
    cardBrand: string;
    handleChange: (field: keyof CardFormState, value: any) => void;
    handleBlur: (field: keyof CardFormState) => void;
}

export default function CreditCardPayment({
                                              formData,
                                              errors,
                                              touched,
                                              isValid,
                                              cardBrand,
                                              handleChange,
                                              handleBlur,
                                          }: CreditCardPaymentProps) {
    const inputStyle =
        "w-full border border-gray-300 rounded-lg outline-none px-4 py-2 focus:border-black focus:ring-1 focus:ring-black transition-all bg-white text-black text-base tracking-wider placeholder:text-gray-400";
    const labelStyle =
        "block text-[13px] font-bold text-black mb-0.5 uppercase tracking-tight";

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length > 0 ? parts.join(" ") : v;
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* Kart Sahibi Adı */}
            <div>
                <label className={labelStyle}>Kart Sahibi Adı</label>
                <input
                    type="text"
                    value={formData.cardholderName}
                    onChange={(e) =>
                        handleChange("cardholderName", e.target.value.toUpperCase())
                    }
                    onBlur={() => handleBlur("cardholderName")}
                    placeholder="AD SOYAD"
                    className={inputStyle}
                />
                {touched.cardholderName && errors.cardholderName && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">
                        {errors.cardholderName}
                    </p>
                )}
            </div>

            {/* Kart Numarası */}
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label className={labelStyle}>Kart Numarası</label>
                    {cardBrand !== "unknown" && (
                        <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded uppercase">
                            {cardBrand}
                        </span>
                    )}
                </div>
                <input
                    type="text"
                    value={formatCardNumber(formData.cardNumber)}
                    onChange={(e) => {
                        const rawValue = e.target.value.replace(/\s/g, "");
                        if (rawValue.length <= 16) handleChange("cardNumber", rawValue);
                    }}
                    onBlur={() => handleBlur("cardNumber")}
                    placeholder="0000 0000 0000 0000"
                    className={inputStyle}
                />
                {touched.cardNumber && errors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">
                        {errors.cardNumber}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Son Kullanma Tarihi */}
                <div>
                    <label className={labelStyle}>Son Kullanma Tarihi</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={formData.expiryMonth}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                if (val.length <= 2) handleChange("expiryMonth", val);
                            }}
                            placeholder="AA"
                            className={`${inputStyle} text-center`}
                        />
                        <span className="text-gray-300 text-2xl">/</span>
                        <input
                            type="text"
                            value={formData.expiryYear}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                if (val.length <= 2) handleChange("expiryYear", val);
                            }}
                            placeholder="YY"
                            className={`${inputStyle} text-center`}
                        />
                    </div>
                    {touched.expiryMonth && errors.expiry && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium">
                            {errors.expiry}
                        </p>
                    )}
                </div>

                {/* CVV */}
                <div>
                    <label className={labelStyle}>CVV</label>
                    <input
                        type="password"
                        value={formData.cvv}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            if (val.length <= (cardBrand === "amex" ? 4 : 3))
                                handleChange("cvv", val);
                        }}
                        placeholder="***"
                        className={`${inputStyle} text-center`}
                    />
                    {touched.cvv && errors.cvv && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium">
                            {errors.cvv}
                        </p>
                    )}
                </div>
            </div>

            {/* Güvenlik Rozetleri */}
            <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] text-green-600">
                        🛡️
                    </div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase leading-none">
                        256-bit SSL
                        <br />
                        Güvenli Ödeme
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] text-blue-600">
                        ✓
                    </div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase leading-none">
                        Bilgileriniz
                        <br />
                        Saklanmaz
                    </div>
                </div>
            </div>
        </div>
    );
}