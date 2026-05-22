"use client";
import { useState } from "react";
import { Save, Shield, FileText, X, ChevronRight, Cookie, Loader2, Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3 } from "lucide-react";
import { settingsService } from "../_services/settingsService";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

interface LegalSettingsProps {
    settings: any;
    onUpdate: () => void;
}

type EditorType = 'terms' | 'privacy' | 'return' | null;

// Toolbar Button Component
const ToolbarButton = ({ onClick, active, children, title }: any) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-2 rounded transition ${
            active
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        title={title}
    >
        {children}
    </button>
);

export default function LegalSettings({ settings, onUpdate }: LegalSettingsProps) {
    const [saving, setSaving] = useState(false);
    const [activeEditor, setActiveEditor] = useState<EditorType>(null);

    const [formData, setFormData] = useState({
        termsOfService: settings?.termsOfService || '',
        privacyPolicy: settings?.privacyPolicy || '',
        returnPolicy: settings?.returnPolicy || '',
        cookieConsentEnabled: settings?.cookieConsentEnabled ?? true,
        gdprComplianceEnabled: settings?.gdprComplianceEnabled ?? false
    });

    const editorConfigs = {
        terms: {
            title: 'Kullanım Şartları',
            field: 'termsOfService',
            placeholder: 'Kullanım şartlarınızı buraya yazın...'
        },
        privacy: {
            title: 'Gizlilik Politikası',
            field: 'privacyPolicy',
            placeholder: 'Gizlilik politikanızı buraya yazın...'
        },
        return: {
            title: 'İade ve Değişim Politikası',
            field: 'returnPolicy',
            placeholder: 'İade ve değişim şartlarınızı buraya yazın...'
        }
    };

    // Tiptap Editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: activeEditor
            ? formData[editorConfigs[activeEditor].field as keyof typeof formData]
            : '',
        onUpdate: ({ editor }) => {
            if (activeEditor) {
                const html = editor.getHTML();
                setFormData({
                    ...formData,
                    [editorConfigs[activeEditor].field]: html
                });
            }
        },
        immediatelyRender: false, // 👈 BUNU EKLE
    });


    // Update editor content when activeEditor changes
    useState(() => {
        if (editor && activeEditor) {
            editor.commands.setContent(formData[editorConfigs[activeEditor].field as keyof typeof formData] || '');
        }
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateSection('legal', formData);
            alert('✅ Yasal ayarlar güncellendi!');
            onUpdate();
            setActiveEditor(null);
        } catch (error) {
            alert('❌ Güncelleme başarısız!');
        } finally {
            setSaving(false);
        }
    };

    const getPreview = (html: string) => {
        if (!html || html.trim() === '' || html === '<p></p>') {
            return 'Henüz içerik eklenmedi';
        }
        const text = html.replace(/<[^>]*>/g, '');
        return text.length > 100 ? text.substring(0, 100) + '...' : text;
    };

    const openEditor = (type: EditorType) => {
        setActiveEditor(type);
        // Set editor content after a short delay
        setTimeout(() => {
            if (editor && type) {
                editor.commands.setContent(formData[editorConfigs[type].field as keyof typeof formData] || '');
            }
        }, 100);
    };

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase">Yasal & Politikalar</h2>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Kullanım şartları, gizlilik ve iade politikaları</p>
                </div>
            </div>

            {/* Compact Privacy Toggles */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase mb-3 flex items-center gap-2">
                    <Shield size={14} />
                    Gizlilik Ayarları
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                        <input
                            type="checkbox"
                            checked={formData.cookieConsentEnabled}
                            onChange={(e) => {
                                setFormData({...formData, cookieConsentEnabled: e.target.checked});
                                setTimeout(() => {
                                    settingsService.updateSection('legal', {...formData, cookieConsentEnabled: e.target.checked});
                                }, 100);
                            }}
                            className="w-4 h-4 rounded border-blue-300 text-blue-600"
                        />
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-blue-900 flex items-center gap-1.5">
                                <Cookie size={12} />
                                Çerez Onayı
                            </p>
                        </div>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-100 transition">
                        <input
                            type="checkbox"
                            checked={formData.gdprComplianceEnabled}
                            onChange={(e) => {
                                setFormData({...formData, gdprComplianceEnabled: e.target.checked});
                                setTimeout(() => {
                                    settingsService.updateSection('legal', {...formData, gdprComplianceEnabled: e.target.checked});
                                }, 100);
                            }}
                            className="w-4 h-4 rounded border-purple-300 text-purple-600"
                        />
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-purple-900">GDPR Uyumluluğu</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Policy Documents */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-200 pb-3 flex items-center gap-2">
                    <FileText size={16} />
                    Politika Metinleri
                </h3>

                {/* Terms of Service */}
                <div
                    onClick={() => openEditor('terms')}
                    className="group p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase mb-2">Kullanım Şartları</h4>
                            <p className="text-[10px] text-slate-500 line-clamp-2">
                                {getPreview(formData.termsOfService)}
                            </p>
                        </div>
                        <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                </div>

                {/* Privacy Policy */}
                <div
                    onClick={() => openEditor('privacy')}
                    className="group p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase mb-2">Gizlilik Politikası</h4>
                            <p className="text-[10px] text-slate-500 line-clamp-2">
                                {getPreview(formData.privacyPolicy)}
                            </p>
                        </div>
                        <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                </div>

                {/* Return Policy */}
                <div
                    onClick={() => openEditor('return')}
                    className="group p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase mb-2">İade ve Değişim Politikası</h4>
                            <p className="text-[10px] text-slate-500 line-clamp-2">
                                {getPreview(formData.returnPolicy)}
                            </p>
                        </div>
                        <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                </div>
            </div>

            {/* Side Panel Editor with Tiptap */}
            <AnimatePresence>
                {activeEditor && editor && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveEditor(null)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />

                        {/* Side Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed right-0 top-0 h-full w-full md:w-[700px] bg-white shadow-2xl z-50 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase">
                                        {editorConfigs[activeEditor].title}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-medium mt-1">
                                        Bu metin /legal/{activeEditor} sayfasında görünecek
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveEditor(null)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Toolbar */}
                            <div className="flex items-center gap-2 p-4 border-b border-slate-200 bg-slate-50 flex-wrap">
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                    active={editor.isActive('heading', { level: 1 })}
                                    title="Başlık 1"
                                >
                                    <Heading1 size={18} />
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                    active={editor.isActive('heading', { level: 2 })}
                                    title="Başlık 2"
                                >
                                    <Heading2 size={18} />
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                    active={editor.isActive('heading', { level: 3 })}
                                    title="Başlık 3"
                                >
                                    <Heading3 size={18} />
                                </ToolbarButton>

                                <div className="w-px h-6 bg-slate-300 mx-1" />

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    active={editor.isActive('bold')}
                                    title="Kalın"
                                >
                                    <Bold size={18} />
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    active={editor.isActive('italic')}
                                    title="İtalik"
                                >
                                    <Italic size={18} />
                                </ToolbarButton>

                                <div className="w-px h-6 bg-slate-300 mx-1" />

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    active={editor.isActive('bulletList')}
                                    title="Madde İşaretli Liste"
                                >
                                    <List size={18} />
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    active={editor.isActive('orderedList')}
                                    title="Numaralı Liste"
                                >
                                    <ListOrdered size={18} />
                                </ToolbarButton>
                            </div>

                            {/* Editor Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <EditorContent
                                    editor={editor}
                                    className="prose prose-slate max-w-none min-h-[500px] p-4 border-2 border-slate-200 rounded-lg focus-within:border-blue-500"
                                />

                                {/* Formatting Guide */}
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-[10px] font-bold text-blue-900 mb-2">💡 Kısayollar:</p>
                                    <ul className="text-[9px] text-blue-700 space-y-1">
                                        <li>• <strong>Ctrl+B:</strong> Kalın</li>
                                        <li>• <strong>Ctrl+I:</strong> İtalik</li>
                                        <li>• <strong># Boşluk:</strong> Başlık 1</li>
                                        <li>• <strong>## Boşluk:</strong> Başlık 2</li>
                                        <li>• <strong>- Boşluk:</strong> Madde işaretli liste</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
                                <button
                                    onClick={() => setActiveEditor(null)}
                                    className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg text-[11px] font-black uppercase hover:bg-slate-100 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    {saving ? 'Kaydediliyor...' : 'Kaydet ve Yayınla'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .ProseMirror {
                    outline: none;
                    min-height: 500px;
                }

                .ProseMirror p {
                    margin-bottom: 1em;
                }

                .ProseMirror h1 {
                    font-size: 2em;
                    font-weight: 900;
                    margin-top: 1em;
                    margin-bottom: 0.5em;
                    text-transform: uppercase;
                }

                .ProseMirror h2 {
                    font-size: 1.5em;
                    font-weight: 900;
                    margin-top: 0.75em;
                    margin-bottom: 0.5em;
                    text-transform: uppercase;
                }

                .ProseMirror h3 {
                    font-size: 1.25em;
                    font-weight: 900;
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                    text-transform: uppercase;
                }

                .ProseMirror ul,
                .ProseMirror ol {
                    padding-left: 1.5em;
                    margin-bottom: 1em;
                }

                .ProseMirror li {
                    margin-bottom: 0.5em;
                }

                .ProseMirror strong {
                    font-weight: 700;
                }

                .ProseMirror em {
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}