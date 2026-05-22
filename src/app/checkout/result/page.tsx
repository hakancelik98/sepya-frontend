"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkoutService } from "@/app/checkout/_services/checkoutService";

function ResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const paymentId = searchParams.get("paymentId");

        if (!paymentId) {
            router.push("/checkout");
            return;
        }

        loadResult(Number(paymentId));
    }, [searchParams]);

    const loadResult = async (paymentId: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await checkoutService.getResult(paymentId);
            setResult(data);

            if (data.paymentStatus === "PAID") {
                router.push(`/checkout/success?order=${data.orderNumber}`);
            }
        } catch (err: any) {
            console.error("Checkout result error:", err);
            setError(err.message || "Ödeme sonucu alınamadı");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-bold">Ödeme sonucu kontrol ediliyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Bir hata oluştu</h1>
                    <p>{error}</p>
                    <button
                        onClick={() => router.push("/checkout")}
                        className="bg-black text-white px-6 py-3"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">
                    {result?.paymentStatus === "REQUIRES_ACTION"
                        ? "3D Secure Bekleniyor"
                        : "Ödeme Başarısız"}
                </h1>
                <p>{result?.message}</p>
                <button
                    onClick={() => router.push("/checkout")}
                    className="bg-black text-white px-6 py-3"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );
}

export default function CheckoutResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-bold">Yükleniyor...</p>
            </div>
        }>
            <ResultContent />
        </Suspense>
    );
}