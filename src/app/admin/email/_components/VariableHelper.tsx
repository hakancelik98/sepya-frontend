"use client";
import { useState } from "react";
import { ChevronRight, ChevronLeft, Copy, Edit3, Check } from "lucide-react";

interface VariableHelperProps {
    variables: string;
    previewVariables: Record<string, string>;
    onInsertVariable: (variable: string) => void;
    onUpdatePreview: (variables: Record<string, string>) => void;
}

export default function VariableHelper({ variables, previewVariables, onInsertVariable, onUpdatePreview }: VariableHelperProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [editingVar, setEditingVar] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [copiedVar, setCopiedVar] = useState<string | null>(null);

    const variableList = variables ? variables.split(',').map(v => v.trim()).filter(Boolean) : [];

    const handleCopyVariable = (variable: string) => {
        navigator.clipboard.writeText(`{{${variable}}}`);
        setCopiedVar(variable);
        setTimeout(() => setCopiedVar(null), 2000);
    };

    const handleEditPreview = (variable: string) => {
        setEditingVar(variable);
        setEditValue(previewVariables[variable] || '');
    };

    const handleSavePreview = () => {
        if (editingVar) {
            onUpdatePreview({
                ...previewVariables,
                [editingVar]: editValue
            });
            setEditingVar(null);
        }
    };

    return (
        <>
            {/* Collapse/Expand Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed ${isOpen ? 'right-96' : 'right-0'} top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-200 rounded-l-xl px-2 py-8 shadow-lg hover:bg-slate-50 transition-all`}
                title={isOpen ? 'Kapat' : 'Değişkenleri Aç'}
            >
                {isOpen ? <ChevronRight size={20} className="text-slate-600" /> : <ChevronLeft size={20} className="text-slate-600" />}
            </button>

            {/* Sidebar */}
            <div className={`fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        🔧 Değişkenler
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                            {variableList.length}
                        </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Template'de kullanılabilir değişkenler</p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 space-y-3">
                    {variableList.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📝</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Henüz değişken yok</p>
                            <p className="text-xs text-slate-500">Ayarlar sekmesinden değişken ekleyin</p>
                        </div>
                    ) : (
                        variableList.map((variable) => (
                            <div
                                key={variable}
                                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all group"
                            >
                                {/* Variable Name */}
                                <div className="flex items-center justify-between mb-3">
                                    <code className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg">
                                        {`{{${variable}}}`}
                                    </code>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => onInsertVariable(variable)}
                                            className="p-2 hover:bg-purple-100 rounded-lg text-purple-600 transition-all"
                                            title="Template'e ekle"
                                        >
                                            {copiedVar === variable ? (
                                                <Check size={14} className="text-green-600" />
                                            ) : (
                                                <Copy size={14} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleEditPreview(variable)}
                                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-all"
                                            title="Preview değerini düzenle"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Value */}
                                {editingVar === variable ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSavePreview();
                                                if (e.key === 'Escape') setEditingVar(null);
                                            }}
                                            placeholder="Önizleme değeri girin"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSavePreview}
                                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
                                            >
                                                Kaydet
                                            </button>
                                            <button
                                                onClick={() => setEditingVar(null)}
                                                className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300 transition-all"
                                            >
                                                İptal
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <p className="text-xs font-medium text-slate-500 mb-1">Önizleme değeri:</p>
                                        <p className="text-sm text-slate-900">
                                            {previewVariables[variable] || <span className="italic text-slate-400">Değer girilmedi</span>}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {/* Info Box */}
                    {variableList.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mt-6">
                            <p className="text-sm font-semibold text-blue-900 mb-3">💡 Nasıl Kullanılır?</p>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li className="flex items-start gap-2">
                                    <Copy size={14} className="mt-0.5 shrink-0" />
                                    <span>Butona tıklayarak template'e ekleyin</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Edit3 size={14} className="mt-0.5 shrink-0" />
                                    <span>Önizleme değerini düzenleyin</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-700 font-mono text-xs mt-0.5 shrink-0">{'{{...}}'}</span>
                                    <span>Değişkenler bu formatla kullanılır</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}