// app/checkout/_components/ShippingForm.tsx

"use client";

import { useShippingForm } from "@/app/checkout/_hooks/useShippingForm";
import type { Address } from "@/lib/types/checkout";
import { MapPin, Phone, Mail } from "lucide-react";

interface ShippingFormProps {
    onSubmit: (address: Address) => void;
    initialData?: Address | null;
}

export default function ShippingForm({
                                         onSubmit,
                                         initialData,
                                     }: ShippingFormProps) {
    const { formData, errors, touched, isSubmitting, isValid, handleChange, handleBlur, handleSubmit } =
        useShippingForm(onSubmit, initialData);

    const inputStyle =
        "w-full border border-gray-200 rounded-xl md:rounded-xl outline-none px-3 md:px-4 py-2.5 md:py-2 text-sm md:text-base focus:border-black focus:ring-2 focus:ring-black/5 transition-all bg-white text-gray-900 font-medium placeholder:text-gray-400";
    const labelStyle =
        "block text-[9px] md:text-[10px] font-black text-gray-700 mb-1.5 md:mb-2 uppercase tracking-[0.15em] md:tracking-[0.2em]";

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6 md:mb-8 flex items-center gap-2">
                <MapPin size={18} className="text-gray-700 md:hidden" />
                <MapPin size={20} className="text-gray-700 hidden md:block" />
                Teslimat Adresi
            </h2>

            {/* ERROR SUMMARY */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl md:rounded-2xl p-3 md:p-4">
                    <h3 className="font-black text-red-900 text-xs md:text-sm mb-2 uppercase tracking-wide">
                        ⚠️ Lütfen şu alanları doldurun:
                    </h3>
                    <ul className="list-disc list-inside text-red-700 text-xs md:text-sm space-y-1">
                        {Object.entries(errors).map(([field, message]) => (
                            <li key={field}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* FIRST NAME - LAST NAME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                <div>
                    <label className={labelStyle}>Ad</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputStyle}
                        placeholder="Adınız"
                    />
                    {touched.firstName && errors.firstName && (
                        <p className="text-red-500 text-[10px] md:text-xs mt-1 md:mt-1.5 font-medium">
                            {errors.firstName}
                        </p>
                    )}
                </div>
                <div>
                    <label className={labelStyle}>Soyad</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputStyle}
                        placeholder="Soyadınız"
                    />
                    {touched.lastName && errors.lastName && (
                        <p className="text-red-500 text-[10px] md:text-xs mt-1 md:mt-1.5 font-medium">
                            {errors.lastName}
                        </p>
                    )}
                </div>
            </div>

            {/* ADDRESS */}
            <div className="space-y-3 md:space-y-5">
                <div>
                    <label className={labelStyle}>Açık Adres</label>
                    <input
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Mahalle, Sokak, No..."
                        className={inputStyle}
                    />
                    {touched.addressLine1 && errors.addressLine1 && (
                        <p className="text-red-500 text-[10px] md:text-xs mt-1 md:mt-1.5 font-medium">
                            {errors.addressLine1}
                        </p>
                    )}
                </div>
                <div>
                    <label className={labelStyle}>Apartman/Daire (Opsiyonel)</label>
                    <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Blok No / İç Kapı"
                        className={inputStyle}
                    />
                </div>
            </div>

            {/* CITY - DISTRICT - POSTAL CODE */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                <div className="col-span-2 md:col-span-1">
                    <label className={labelStyle}>Şehir</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputStyle}
                        placeholder="İstanbul"
                    />
                    {touched.city && errors.city && (
                        <p className="text-red-500 text-[10px] md:text-xs mt-1 md:mt-1.5 font-medium">
                            {errors.city}
                        </p>
                    )}
                </div>
                <div className="col-span-1 md:col-span-1">
                    <label className={labelStyle}>İlçe</label>
                    <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputStyle}
                        placeholder="Beyoğlu"
                    />
                    {touched.district && errors.district && (
                        <p className="text-red-500 text-[10px] md:text-xs mt-1 md:mt-1.5 font-medium">
                            {errors.district}
                        </p>
                    )}
                </div>
                <div className="col-span-1 md:col-span-1">
                    <label className={labelStyle}>Posta Kodu</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputStyle}
                        placeholder="34000"
                    />
                    {touched.postalCode && errors.postalCode && (
                        <p className="text-red-500 text-[10px] md:text-xs mt-1 md:mt-1.5 font-medium">
                            {errors.postalCode}
                        </p>
                    )}
                </div>
            </div>

            {/* PHONE - EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                <div>
                    <label className={labelStyle + " flex items-center gap-1.5 md:gap-2"}>
                        <Phone size={12} className="md:hidden" />
                        <Phone size={14} className="hidden md:block" />
                        Telefon
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="05xx"
                        className={inputStyle}
                    />
                    {touched.phone && errors.phone && (
                        <p className="text-red-500 text-[10px] md:text-xs mt-1 md:mt-1.5 font-medium">
                            {errors.phone}
                        </p>
                    )}
                </div>
                <div>
                    <label className={labelStyle + " flex items-center gap-1.5 md:gap-2"}>
                        <Mail size={12} className="md:hidden" />
                        <Mail size={14} className="hidden md:block" />
                        E-posta
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="ornek@mail.com"
                        className={inputStyle}
                    />
                    {touched.email && errors.email && (
                        <p className="text-red-500 text-[10px] md:text-xs mt-1 md:mt-1.5 font-medium">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
                type="submit"
                disabled={isSubmitting}
                onClick={() => {
                    // Form asıl işini yaparken biz sayfayı yukarı alıyoruz
                    setTimeout(() => {
                        window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: "smooth",
                        });
                    }, 100); // 100ms gecikme render çakışmalarını önler
                }}
                className="w-full mt-6 md:mt-8 bg-black text-white py-4 md:py-5 rounded-xl md:rounded-2xl text-xs md:text-sm font-black uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-zinc-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-lg active:scale-95"
            >
                {isSubmitting ? "YÜKLENİYOR..." : "ÖDEME ADIMINA GEÇ"}
            </button>
        </form>
    );
}