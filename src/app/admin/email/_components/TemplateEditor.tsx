"use client";
import { useState, useEffect } from "react";
import { X, Save, Eye, Code, Smartphone, Monitor, Tablet, Loader2, AlertCircle } from "lucide-react";
import { emailManagerService } from "@/app/admin/settings/_services/settingsService";
import CodeEditor from "./CodeEditor";
import PreviewPanel from "./PreviewPanel";
import VariableHelper from "./VariableHelper";

interface TemplateEditorProps {
    template: any;
    onClose: () => void;
}

export default function TemplateEditor({ template, onClose }: TemplateEditorProps) {
    const [activeView, setActiveView] = useState<'split' | 'code' | 'preview'>('split');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Form state
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

    // Preview state
    const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({
        customerName: 'Ahmet Yılmaz',
        orderNumber: 'ORD-2024-12345',
        totalAmount: '1,299.99',
        orderDate: new Date().toLocaleDateString('tr-TR'),
        customerEmail: 'ahmet@example.com',
        registrationDate: new Date().toLocaleDateString('tr-TR')
    });

    // Track changes
    useEffect(() => {
        setHasChanges(true);
    }, [formData]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await emailManagerService.updateTemplate(template.id, formData);
            setHasChanges(false);
            alert('✅ Template başarıyla kaydedildi!');
            onClose();
        } catch (error) {
            alert('❌ Kaydetme başarısız!');
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

        setFormData({
            ...formData,
            htmlContent: before + variableTag + after
        });

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + variableTag.length, start + variableTag.length);
        }, 0);
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* HEADER - More spacious */}
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
                                Template Düzenle
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {template.name}
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
                        {/* View Mode - Better spacing */}
                        <div className="flex bg-slate-100 rounded-xl p-1.5 gap-1">
                            <button
                                onClick={() => setActiveView('code')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    activeView === 'code'
                                        ? 'bg-white shadow-sm text-slate-900'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Code size={16} className="inline mr-2" />
                                Kod
                            </button>
                            <button
                                onClick={() => setActiveView('split')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    activeView === 'split'
                                        ? 'bg-white shadow-sm text-slate-900'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                Bölünmüş
                            </button>
                            <button
                                onClick={() => setActiveView('preview')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    activeView === 'preview'
                                        ? 'bg-white shadow-sm text-slate-900'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Eye size={16} className="inline mr-2" />
                                Önizleme
                            </button>
                        </div>

                        {/* Device Preview */}
                        {(activeView === 'preview' || activeView === 'split') && (
                            <div className="flex bg-slate-100 rounded-xl p-1.5 gap-1">
                                <button
                                    onClick={() => setPreviewDevice('mobile')}
                                    className={`p-2.5 rounded-lg transition-all ${
                                        previewDevice === 'mobile'
                                            ? 'bg-white shadow-sm text-slate-900'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                    title="Mobil"
                                >
                                    <Smartphone size={18} />
                                </button>
                                <button
                                    onClick={() => setPreviewDevice('tablet')}
                                    className={`p-2.5 rounded-lg transition-all ${
                                        previewDevice === 'tablet'
                                            ? 'bg-white shadow-sm text-slate-900'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                    title="Tablet"
                                >
                                    <Tablet size={18} />
                                </button>
                                <button
                                    onClick={() => setPreviewDevice('desktop')}
                                    className={`p-2.5 rounded-lg transition-all ${
                                        previewDevice === 'desktop'
                                            ? 'bg-white shadow-sm text-slate-900'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                    title="Masaüstü"
                                >
                                    <Monitor size={18} />
                                </button>
                            </div>
                        )}

                        {/* Save Button - MUCH MORE VISIBLE */}
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Kaydet
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden">
                {/* CODE EDITOR */}
                {(activeView === 'code' || activeView === 'split') && (
                    <div className={`${activeView === 'split' ? 'w-1/2' : 'w-full'} flex flex-col border-r border-slate-200 bg-white overflow-hidden`}>
                        <CodeEditor
                            formData={formData}
                            setFormData={setFormData}
                            onInsertVariable={insertVariable}
                        />
                    </div>
                )}

                {/* PREVIEW PANEL */}
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

            {/* VARIABLE HELPER SIDEBAR */}
            <VariableHelper
                variables={formData.availableVariables}
                previewVariables={previewVariables}
                onInsertVariable={insertVariable}
                onUpdatePreview={setPreviewVariables}
            />
        </div>
    );
}