"use client";
import { useState, useEffect } from "react";
import { X, Save, Eye, Code, Smartphone, Monitor, Tablet, Loader2, AlertCircle } from "lucide-react";
import { emailManagerService } from "@/app/admin/settings/_services/settingsService";
import CodeEditor from "./CodeEditor";
import PreviewPanel from "./PreviewPanel";
import VariableHelper from "./VariableHelper";

interface TemplateEditorProps {
    template: any;
    isNew?: boolean;
    onClose: () => void;
}

export default function TemplateEditor({ template, isNew = false, onClose }: TemplateEditorProps) {
    const [activeView, setActiveView] = useState<'split' | 'code' | 'preview'>('split');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(isNew);

    const [formData, setFormData] = useState({
        name: template.name || '',
        templateCode: template.templateCode || '',
        description: template.description || '',
        subject: template.subject || '',
        htmlContent: template.htmlContent || '',
        textContent: template.textContent || '',
        category: template.category || 'CUSTOMER',
        availableVariables: template.availableVariables || '',
        active: template.active ?? true
    });

    const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({
        customerName: 'Ahmet Yılmaz',
        orderNumber: 'ORD-2024-12345',
        totalAmount: '1,299.99',
        orderDate: new Date().toLocaleDateString('tr-TR'),
        customerEmail: 'ahmet@example.com',
        registrationDate: new Date().toLocaleDateString('tr-TR'),
        resetLink: 'https://sepyaesarp.com/reset-password?token=ornek-token',
        expiryMinutes: '30',
    });

    useEffect(() => {
        if (!isNew) setHasChanges(true);
    }, [formData]);

    const handleSave = async () => {
        if (!formData.templateCode || !formData.name || !formData.subject || !formData.htmlContent) {
            alert('❌ Template Kodu, Ad, Konu ve HTML İçerik zorunludur!');
            return;
        }

        setSaving(true);
        try {
            if (isNew) {
                await emailManagerService.createTemplate(formData);
                alert('✅ Template başarıyla oluşturuldu!');
            } else {
                await emailManagerService.updateTemplate(template.id, formData);
                alert('✅ Template başarıyla kaydedildi!');
            }
            setHasChanges(false);
            onClose();
        } catch (error) {
            alert(isNew ? '❌ Oluşturma başarısız!' : '❌ Kaydetme başarısız!');
        } finally {
            setSaving(false);
        }
    };

    const insertVariable = (variable: string) => {
        const textarea = document.querySelector('textarea[name="htmlContent"]') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.htmlContent;
        const before = text.substring(0, start);
        const after = text.substring(end);
        const variableTag = `{{${variable}}}`;

        setFormData({ ...formData, htmlContent: before + variableTag + after });

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + variableTag.length, start + variableTag.length);
        }, 0);
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <header className="bg-white border-b border-slate-200 px-8 py-5 shrink-0 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all"
                            title="Kapat"
                        >
                            <X size={22} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {isNew ? 'Yeni Template' : 'Template Düzenle'}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {isNew ? 'Yeni bir email template oluşturun' : template.name}
                            </p>
                        </div>
                        {hasChanges && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                                <AlertCircle size={14} className="text-amber-600" />
                                <span className="text-xs font-medium text-amber-700">Kaydedilmemiş değişiklikler</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 rounded-xl p-1.5 gap-1">
                            <button
                                onClick={() => setActiveView('code')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    activeView === 'code' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Code size={16} className="inline mr-2" />Kod
                            </button>
                            <button
                                onClick={() => setActiveView('split')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    activeView === 'split' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                Bölünmüş
                            </button>
                            <button
                                onClick={() => setActiveView('preview')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    activeView === 'preview' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Eye size={16} className="inline mr-2" />Önizleme
                            </button>
                        </div>

                        {(activeView === 'preview' || activeView === 'split') && (
                            <div className="flex bg-slate-100 rounded-xl p-1.5 gap-1">
                                {(['mobile', 'tablet', 'desktop'] as const).map((d) => {
                                    const Icon = d === 'mobile' ? Smartphone : d === 'tablet' ? Tablet : Monitor;
                                    return (
                                        <button
                                            key={d}
                                            onClick={() => setPreviewDevice(d)}
                                            className={`p-2.5 rounded-lg transition-all ${previewDevice === d ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            <Icon size={18} />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                        >
                            {saving ? (
                                <><Loader2 size={18} className="animate-spin" />Kaydediliyor...</>
                            ) : (
                                <><Save size={18} />{isNew ? 'Oluştur' : 'Kaydet'}</>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {(activeView === 'code' || activeView === 'split') && (
                    <div className={`${activeView === 'split' ? 'w-1/2' : 'w-full'} flex flex-col border-r border-slate-200 bg-white overflow-hidden`}>
                        <CodeEditor
                            formData={formData}
                            setFormData={setFormData}
                            onInsertVariable={insertVariable}
                        />
                    </div>
                )}

                {(activeView === 'preview' || activeView === 'split') && (
                    <div className={`${activeView === 'split' ? 'w-1/2' : 'w-full'} flex flex-col overflow-hidden`}>
                        <PreviewPanel
                            htmlContent={formData.htmlContent}
                            subject={formData.subject}
                            variables={previewVariables}
                            device={previewDevice}
                        />
                    </div>
                )}
            </div>

            <VariableHelper
                variables={formData.availableVariables}
                previewVariables={previewVariables}
                onInsertVariable={insertVariable}
                onUpdatePreview={setPreviewVariables}
            />
        </div>
    );
}