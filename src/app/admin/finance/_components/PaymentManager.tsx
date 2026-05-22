"use client";
import { useEffect, useState } from "react";
import { CreditCard, Wallet, Building2, Edit2, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { financeService } from "../_services/financeService";

export default function PaymentManager() {
    const [methods, setMethods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [showKeys, setShowKeys] = useState(false);
    const [paymentStats, setPaymentStats] = useState({
        successRate: 0,
        totalTransactions: 0,
        successfulPayments: 0
    });

    const [providerConfig, setProviderConfig] = useState({
        apiKey: "sandbox-bk_test_51...",
        secretKey: "sandbox-sk_test_92...",
        merchantId: "1234567"
    });

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const [methodsData, statsData] = await Promise.all([
                    financeService.getPaymentMethods(),
                    financeService.getPaymentStats()
                ]);
                setMethods(methodsData);
                setPaymentStats(statsData);
            } catch (error) {
                console.error("Ödeme yöntemleri yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentData();
    }, []);

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            await financeService.updatePaymentMethodStatus(id, !currentStatus);
            setMethods(prev => prev.map(m => m.id === id ? {...m, active: !currentStatus} : m));
        } catch (error) {
            alert("Durum güncellenemedi.");
        }
    };

    const handleSaveConfig = async () => {
        setSaveLoading(true);
        try {
            await financeService.updatePaymentConfig(providerConfig);
            alert("API Ayarları başarıyla güncellendi.");
        } catch (error) {
            alert("Hata: Ayarlar kaydedilemedi.");
        } finally {
            setSaveLoading(false);
        }
    };

    const getIcon = (provider: string) => {
        switch(provider.toLowerCase()) {
            case 'iyzico': return CreditCard;
            case 'manuel': return Building2;
            default: return Wallet;
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="max-w-5xl space-y-6">
            <div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Ödeme Altyapısı</h2>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Sanal POS ve ödeme kanalları konfigürasyonu</p>
            </div>

            {/* Özet Kartlar */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Aktif Kanallar</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{methods.filter(m => m.active).length} / {methods.length}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-[9px] font-black text-blue-600 uppercase">Başarı Oranı</p>
                    <p className="text-2xl font-black text-blue-700 mt-1">%{paymentStats.successRate.toFixed(1)}</p>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 text-white">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Varsayılan Para Birimi</p>
                    <p className="text-2xl font-black mt-1">TRY (₺)</p>
                </div>
            </div>

            {/* Yöntem Listesi */}
            <div className="space-y-3">
                {methods.map((method) => {
                    const Icon = getIcon(method.provider);
                    return (
                        <div key={method.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between group hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${method.active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900">{method.name}</h3>
                                        {method.provider === 'Iyzico' && <span className="text-[8px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-black uppercase">PCI-DSS</span>}
                                    </div>
                                    <p className="text-[11px] text-slate-500">{method.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">%{method.commissionRate || 0}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Komisyon</p>
                                </div>
                                <div className="flex items-center gap-3 border-l pl-6 border-slate-100">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={method.active}
                                            onChange={() => handleToggleActive(method.id, method.active)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                                    </label>
                                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* API Ayarları Panel */}
            <div className="bg-white border-2 border-blue-100 rounded-2xl overflow-hidden shadow-xl shadow-blue-50">
                <div className="bg-blue-600 p-4 flex items-center justify-between">
                    <h3 className="text-white font-black uppercase text-sm flex items-center gap-2">
                        <Lock size={16} />
                        İyzico Provider Konfigürasyonu
                    </h3>
                    <button
                        onClick={() => setShowKeys(!showKeys)}
                        className="text-blue-100 hover:text-white transition-colors"
                    >
                        {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">API Key</label>
                            <input
                                type={showKeys ? "text" : "password"}
                                value={providerConfig.apiKey}
                                onChange={(e) => setProviderConfig({...providerConfig, apiKey: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Secret Key</label>
                            <input
                                type={showKeys ? "text" : "password"}
                                value={providerConfig.secretKey}
                                onChange={(e) => setProviderConfig({...providerConfig, secretKey: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleSaveConfig}
                            disabled={saveLoading}
                            className="w-full bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saveLoading ? <Loader2 size={18} className="animate-spin" /> : 'API Bağlantısını Güncelle'}
                        </button>
                    </div>
                </div>
                <div className="bg-slate-50 p-3 border-t border-slate-100">
                    <p className="text-[9px] text-slate-400 text-center font-medium">
                        Bu ayarlar <b>application-prod.yml</b> dosyasındaki <code>app.payment</code> prefix'ini ezer.
                    </p>
                </div>
            </div>
        </div>
    );
}