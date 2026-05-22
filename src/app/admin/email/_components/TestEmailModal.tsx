"use client";
import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface TestEmailModalProps {
    template: any;
    onClose: () => void;
}

export default function TestEmailModal({ template, onClose }: TestEmailModalProps) {
    const [testEmail, setTestEmail] = useState("");
    const [sending, setSending] = useState(false);

    const handleSendTest = async () => {
        if (!testEmail) {
            alert("Email adresi gerekli!");
            return;
        }

        setSending(true);
        try {
            await axios.post(`${API_BASE}/admin/email/templates/${template.id}/test`, {
                testEmail,
                variables: {
                    customerName: "Test Kullanıcı",
                    orderNumber: "TEST-12345",
                    totalAmount: "299.99",
                    orderDate: new Date().toLocaleDateString('tr-TR'),
                    customerEmail: testEmail,
                    registrationDate: new Date().toLocaleDateString('tr-TR')
                }
            });
            alert("✅ Test maili gönderildi! Email kutunuzu kontrol edin.");
            onClose();
        } catch (error) {
            alert("❌ Test maili gönderilemedi!");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-black uppercase text-slate-900">Test Mail Gönder</h2>
                        <p className="text-xs text-slate-500 mt-1">{template.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-600 uppercase mb-2">
                            Test Email Adresi *
                        </label>
                        <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="test@gmail.com"
                            autoFocus
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-[10px] font-black text-blue-900 uppercase mb-2">Test Değişkenleri</p>
                        <div className="space-y-1 text-xs text-blue-800">
                            <p>• <span className="font-mono">customerName:</span> Test Kullanıcı</p>
                            <p>• <span className="font-mono">orderNumber:</span> TEST-12345</p>
                            <p>• <span className="font-mono">totalAmount:</span> 299.99</p>
                            <p>• <span className="font-mono">orderDate:</span> {new Date().toLocaleDateString('tr-TR')}</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-[10px] text-amber-800 font-medium">
                            ⚠️ Test maili gerçek değişkenler yerine örnek verilerle gönderilecektir.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={sending}
                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-black text-sm uppercase hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSendTest}
                        disabled={sending}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-black text-sm uppercase flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {sending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Gönderiliyor...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Test Gönder
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}