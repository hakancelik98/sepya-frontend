"use client";

import { useState } from "react";

export default function WebhookTesterPage() {
    const [paymentId, setPaymentId] = useState("");
    const [status, setStatus] = useState("PAID");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    const sendWebhook = async () => {
        if (!paymentId) return;

        try {
            setLoading(true);
            setError(null);
            setResult(null);

            const res = await fetch(
                `${API_BASE}/payments/webhook/manual`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        paymentId: Number(paymentId),
                        status,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Webhook gönderilemedi");
            }

            setResult(data);
        } catch (err: any) {
            console.error("Webhook test error:", err);
            setError(err.message || "Webhook hatası");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-8">Webhook Test Paneli</h1>

            <div className="space-y-6 bg-white p-6 border rounded">
                <div>
                    <label className="block text-sm font-bold mb-2">Payment ID</label>
                    <input
                        type="number"
                        value={paymentId}
                        onChange={(e) => setPaymentId(e.target.value)}
                        className="w-full border px-4 py-2"
                        placeholder="123"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border px-4 py-2"
                    >
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                        <option value="CANCELED">CANCELED</option>
                    </select>
                </div>

                <button
                    onClick={sendWebhook}
                    disabled={loading || !paymentId}
                    className="w-full bg-black text-white py-3 disabled:bg-gray-300"
                >
                    {loading ? "Gönderiliyor..." : "Webhook Gönder"}
                </button>

                {error && (
                    <div className="text-red-600 text-sm font-bold">
                        {error}
                    </div>
                )}

                {result && (
                    <pre className="bg-gray-100 p-4 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
                )}
            </div>
        </div>
    );
}
