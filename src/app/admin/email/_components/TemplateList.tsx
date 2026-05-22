"use client";
import { Edit2, Send, Loader2 } from "lucide-react";

interface TemplateListProps {
    templates: any[];
    loading: boolean;
    onEdit: (template: any) => void;
    onToggle: (id: number) => void;
    onTest: (template: any) => void;
}

export default function TemplateList({ templates, loading, onEdit, onToggle, onTest }: TemplateListProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
                <div
                    key={template.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-xl hover:border-slate-300 transition-all group"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-black text-slate-900 text-lg">{template.name}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                    template.category === 'CUSTOMER' ? 'bg-blue-100 text-blue-700' :
                                        template.category === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                            'bg-slate-100 text-slate-700'
                                }`}>
                                    {template.category}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1">{template.description}</p>
                            <p className="text-[10px] font-mono text-slate-400">{template.templateCode}</p>
                        </div>

                        {/* Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={template.active}
                                onChange={() => onToggle(template.id)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>

                    {/* Subject Preview */}
                    <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-100">
                        <p className="text-[10px] font-black text-slate-600 uppercase mb-1">📨 Konu</p>
                        <p className="text-xs text-slate-700 font-medium truncate">{template.subject}</p>
                    </div>

                    {/* Variables */}
                    {template.availableVariables && (
                        <div className="mb-3">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1.5">Değişkenler</p>
                            <div className="flex flex-wrap gap-1">
                                {template.availableVariables.split(',').slice(0, 4).map((variable: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-mono font-bold"
                                    >
                                        {`{{${variable.trim()}}}`}
                                    </span>
                                ))}
                                {template.availableVariables.split(',').length > 4 && (
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">
                                        +{template.availableVariables.split(',').length - 4}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3 py-2 border-t border-slate-100">
                        <span className="font-bold">📊 {template.sentCount || 0} kez gönderildi</span>
                        {template.lastSentAt && (
                            <span>Son: {new Date(template.lastSentAt).toLocaleDateString('tr-TR')}</span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(template)}
                            className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                        >
                            <Edit2 size={12} /> Düzenle
                        </button>
                        <button
                            onClick={() => onTest(template)}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                        >
                            <Send size={12} /> Test
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}