"use client";
import { useEffect, useState } from "react";
import { Truck, Plus, Trash2, Settings, Loader2, Save, Link as LinkIcon, Banknote, Percent, Building2, User, CreditCard, Hash, Globe } from "lucide-react";
import { financeService } from "../_services/financeService";

export default function ShippingManager() {
    const [shippingRules, setShippingRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);

    // Tüm alanları içeren genişletilmiş state
    const [globalSettings, setGlobalSettings] = useState({
        defaultPrice: 0,
        freeShippingLimit: 0,
        announcementText: "",
        trackingUrlTemplate: "",
        provider: "",
        codFee: 0,
        transferDiscount: 0,
        // ✅ YENİ: Banka bilgileri
        bankName: "",
        bankBranch: "",
        accountHolder: "",
        iban: "",
        accountNumber: "",
        swiftCode: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const rules = await financeService.getShippingRules();
            setShippingRules(rules);

            const activeRule = rules.find((r: any) => r.active) || rules[0];
            if (activeRule) {
                setGlobalSettings({
                    defaultPrice: activeRule.price || 0,
                    freeShippingLimit: activeRule.freeAbove || 0,
                    announcementText: activeRule.announcementText || `₺${activeRule.freeAbove} ve üzeri alışverişlerde kargo bedava!`,
                    trackingUrlTemplate: activeRule.trackingUrlTemplate || "",
                    provider: activeRule.provider || "",
                    codFee: activeRule.codFee || 0,
                    transferDiscount: activeRule.transferDiscount || 0,
                    // ✅ YENİ: Banka bilgilerini yükle
                    bankName: activeRule.bankName || "",
                    bankBranch: activeRule.bankBranch || "",
                    accountHolder: activeRule.accountHolder || "",
                    iban: activeRule.iban || "",
                    accountNumber: activeRule.accountNumber || "",
                    swiftCode: activeRule.swiftCode || ""
                });
            }
        } catch (error) {
            console.error("Kargo bilgileri çekilemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleActive = async (rule: any) => {
        try {
            const updated = { ...rule, active: !rule.active };
            await financeService.updateShippingRule(rule.id, updated);
            await fetchData();
        } catch (error) {
            alert("Durum güncellenirken hata oluştu.");
        }
    };

    const handleAddNew = async () => {
        const newRule = {
            name: "Yeni Kargo Yöntemi",
            provider: "Kargo Firması",
            price: 50,
            freeAbove: 1000,
            estimatedDays: "1-3",
            active: false,
            trackingUrlTemplate: "",
            codFee: 0,
            transferDiscount: 0,
            bankName: "",
            bankBranch: "",
            accountHolder: "",
            iban: "",
            accountNumber: "",
            swiftCode: ""
        };
        try {
            await financeService.createShippingRule(newRule);
            await fetchData();
        } catch (error) {
            alert("Yeni kural eklenemedi.");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bu kargo kuralını silmek istediğinize emin misiniz?')) {
            try {
                await financeService.deleteShippingRule(id);
                setShippingRules(rules => rules.filter(r => r.id !== id));
            } catch (error) {
                alert("Silme işlemi başarısız.");
            }
        }
    };

    const handleSaveGlobalSettings = async () => {
        setSaveLoading(true);
        try {
            const activeRule = shippingRules.find(r => r.active) || shippingRules[0];

            const payload = {
                price: globalSettings.defaultPrice,
                freeAbove: globalSettings.freeShippingLimit,
                provider: globalSettings.provider,
                trackingUrlTemplate: globalSettings.trackingUrlTemplate,
                announcementText: globalSettings.announcementText,
                codFee: globalSettings.codFee,
                transferDiscount: globalSettings.transferDiscount,
                // ✅ YENİ: Banka bilgilerini kaydet
                bankName: globalSettings.bankName,
                bankBranch: globalSettings.bankBranch,
                accountHolder: globalSettings.accountHolder,
                iban: globalSettings.iban,
                accountNumber: globalSettings.accountNumber,
                swiftCode: globalSettings.swiftCode
            };

            if (!activeRule) {
                await financeService.createShippingRule({
                    ...payload,
                    name: "Standart Kargo",
                    active: true,
                    estimatedDays: "1-3 İş Günü"
                });
            } else {
                await financeService.updateShippingRule(activeRule.id, {
                    ...activeRule,
                    ...payload
                });
            }

            await fetchData();
            alert("Kargo, ödeme koşulları ve banka bilgileri başarıyla güncellendi!");
        } catch (error) {
            alert("Ayarlar kaydedilemedi.");
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-slate-900" /></div>;

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Lojistik ve Ödeme Koşulları</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Kargo maliyetleri ve ödeme bazlı fiyatlandırma</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                    <Plus size={14} />
                    Yeni Yöntem Ekle
                </button>
            </div>

            {/* Mevcut Kargo Kuralları Listesi */}
            <div className="space-y-4">
                {shippingRules.map((rule) => (
                    <div key={rule.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">{rule.name}</h3>
                                        {rule.active && <span className="text-[8px] px-2 py-0.5 bg-emerald-500 text-white rounded-full font-black uppercase">Aktif</span>}
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Firma: <span className="text-slate-900">{rule.provider}</span></span>
                                        <span>Havale: <span className="text-emerald-600">-%{rule.transferDiscount}</span></span>
                                        <span>Kapıda Ödeme: <span className="text-orange-600">+₺{rule.codFee}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <p className="text-xl font-black text-slate-900">₺{rule.price}</p>
                                        <p className="text-[9px] text-slate-400 font-black uppercase">Kargo</p>
                                    </div>
                                    <div className="text-center border-l border-slate-100 pl-8">
                                        <p className="text-xl font-black text-emerald-600">₺{rule.freeAbove}</p>
                                        <p className="text-[9px] text-slate-400 font-black uppercase">Ücretsiz Limit</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
                                    <button onClick={() => handleToggleActive(rule)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${rule.active ? 'bg-slate-100 text-slate-900' : 'bg-emerald-600 text-white shadow-md'}`}>
                                        {rule.active ? 'Devre Dışı Bırak' : 'Etkinleştir'}
                                    </button>
                                    <button onClick={() => handleDelete(rule.id)} className="p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hızlı Politika Güncelleme Paneli */}
            <div className="bg-zinc-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-black text-white mb-6 flex items-center gap-3 text-xl uppercase tracking-tighter">
                        <Settings className="text-blue-400" />
                        Hızlı Politika Güncelleme
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Kargo Firması */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Kargo Firması</label>
                            <input
                                type="text"
                                value={globalSettings.provider}
                                onChange={(e) => setGlobalSettings({...globalSettings, provider: e.target.value})}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* 2. Kargo Ücreti */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Kargo Ücreti</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black">₺</span>
                                <input
                                    type="number"
                                    value={globalSettings.defaultPrice}
                                    onChange={(e) => setGlobalSettings({...globalSettings, defaultPrice: Number(e.target.value)})}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-10 py-4 text-lg font-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* 3. Ücretsiz Kargo Limiti */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Ücretsiz Kargo Limiti</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black">₺</span>
                                <input
                                    type="number"
                                    value={globalSettings.freeShippingLimit}
                                    onChange={(e) => setGlobalSettings({...globalSettings, freeShippingLimit: Number(e.target.value)})}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-10 py-4 text-lg font-black focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* 4. Kapıda Ödeme Bedeli */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Kapıda Ödeme Bedeli</label>
                            <div className="relative">
                                <Banknote size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                                <input
                                    type="number"
                                    value={globalSettings.codFee}
                                    onChange={(e) => setGlobalSettings({...globalSettings, codFee: Number(e.target.value)})}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-10 py-4 text-lg font-black focus:ring-2 focus:ring-orange-500 outline-none transition-all text-orange-400"
                                />
                            </div>
                        </div>

                        {/* 5. Havale İndirimi */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Havale İndirimi (%)</label>
                            <div className="relative">
                                <Percent size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                                <input
                                    type="number"
                                    value={globalSettings.transferDiscount}
                                    onChange={(e) => setGlobalSettings({...globalSettings, transferDiscount: Number(e.target.value)})}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-10 py-4 text-lg font-black focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-400"
                                />
                            </div>
                        </div>

                        {/* 6. Takip URL Şablonu */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Takip URL Şablonu</label>
                            <div className="relative">
                                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="https://kargo.com/track?no="
                                    value={globalSettings.trackingUrlTemplate}
                                    onChange={(e) => setGlobalSettings({...globalSettings, trackingUrlTemplate: e.target.value})}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-4 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ✅ YENİ: BANKA BİLGİLERİ BÖLÜMÜ */}
                    <div className="mt-8 pt-8 border-t border-zinc-700">
                        <h4 className="font-black text-white mb-6 flex items-center gap-3 text-lg uppercase tracking-tighter">
                            <Building2 className="text-blue-400" />
                            Havale İçin Banka Bilgileri
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Banka Adı */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Banka Adı</label>
                                <div className="relative">
                                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                                    <input
                                        type="text"
                                        placeholder="Örn: Ziraat Bankası"
                                        value={globalSettings.bankName}
                                        onChange={(e) => setGlobalSettings({...globalSettings, bankName: e.target.value})}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Şube */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Şube</label>
                                <input
                                    type="text"
                                    placeholder="Örn: Kadıköy Şubesi"
                                    value={globalSettings.bankBranch}
                                    onChange={(e) => setGlobalSettings({...globalSettings, bankBranch: e.target.value})}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Hesap Sahibi */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Hesap Sahibi</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                                    <input
                                        type="text"
                                        placeholder="Şirket/Kişi Adı"
                                        value={globalSettings.accountHolder}
                                        onChange={(e) => setGlobalSettings({...globalSettings, accountHolder: e.target.value})}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* IBAN */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">IBAN</label>
                                <div className="relative">
                                    <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                                    <input
                                        type="text"
                                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                                        value={globalSettings.iban}
                                        onChange={(e) => setGlobalSettings({...globalSettings, iban: e.target.value.toUpperCase()})}
                                        maxLength={26}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-4 text-sm font-bold font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-emerald-300"
                                    />
                                </div>
                            </div>

                            {/* Hesap Numarası */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Hesap Numarası</label>
                                <div className="relative">
                                    <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                                    <input
                                        type="text"
                                        placeholder="0000000000"
                                        value={globalSettings.accountNumber}
                                        onChange={(e) => setGlobalSettings({...globalSettings, accountNumber: e.target.value})}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-4 text-sm font-bold font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* SWIFT Kodu */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">SWIFT/BIC</label>
                                <div className="relative">
                                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                                    <input
                                        type="text"
                                        placeholder="TCZBTR2AXXX"
                                        value={globalSettings.swiftCode}
                                        onChange={(e) => setGlobalSettings({...globalSettings, swiftCode: e.target.value.toUpperCase()})}
                                        maxLength={11}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-4 text-sm font-bold font-mono focus:ring-2 focus:ring-purple-500 outline-none text-purple-300"
                                    />
                                </div>
                            </div>

                            {/* Kaydet Butonu */}
                            <div className="flex flex-col justify-end md:col-span-2 lg:col-span-1">
                                <button
                                    onClick={handleSaveGlobalSettings}
                                    disabled={saveLoading}
                                    className="w-full h-[60px] bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
                                >
                                    {saveLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {saveLoading ? 'Güncelleniyor...' : 'Veritabanına Uygula'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}