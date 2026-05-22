"use client";
import { useState, useEffect } from "react";
import { Mail, BarChart3, FileText } from "lucide-react";
import { emailManagerService } from "@/app/admin/settings/_services/settingsService";
import TemplateList from "./_components/TemplateList";
import TemplateEditor from "./_components/TemplateEditor";
import EmailLogs from "./_components/EmailLogs";
import EmailStats from "./_components/EmailStats";
import TestEmailModal from "./_components/TestEmailModal";

export default function EmailManager() {
    const [activeTab, setActiveTab] = useState<'templates' | 'logs' | 'stats'>('templates');
    const [templates, setTemplates] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);

    // Editor state
    const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
    const [showEditor, setShowEditor] = useState(false);

    // Test modal state
    const [showTestModal, setShowTestModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let data;
            if (activeTab === 'templates') {
                data = await emailManagerService.getTemplates();
                setTemplates(data);
            } else if (activeTab === 'logs') {
                data = await emailManagerService.getLogs();
                setLogs(data);
            } else if (activeTab === 'stats') {
                data = await emailManagerService.getStats();
                setStats(data);
            }
        } catch (error) {
            console.error("Veri yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTemplate = async (id: number) => {
        try {
            await emailManagerService.toggleTemplate(id);
            fetchData();
        } catch (error) {
            alert("Durum değiştirilemedi");
        }
    };

    const handleEditTemplate = (template: any) => {
        setEditingTemplate(template);
        setShowEditor(true);
    };

    const handleCloseEditor = () => {
        setShowEditor(false);
        setEditingTemplate(null);
        fetchData(); // Refresh data after editing
    };

    const handleOpenTestModal = (template: any) => {
        setSelectedTemplate(template);
        setShowTestModal(true);
    };

    const handleCloseTestModal = () => {
        setShowTestModal(false);
        setSelectedTemplate(null);
    };

    // Editor açıkken full screen göster
    if (showEditor && editingTemplate) {
        return (
            <TemplateEditor
                template={editingTemplate}
                onClose={handleCloseEditor}
            />
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
            {/* HEADER - More spacious and modern */}
            <header className="px-8 py-8 bg-white border-b border-slate-200 shadow-sm shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            📧 Email Yönetimi
                        </h1>
                        <p className="text-sm text-slate-500 mt-2">
                            Template'leri düzenleyin, mail loglarını görüntüleyin ve istatistikleri inceleyin
                        </p>
                    </div>
                    {stats.todaySent !== undefined && (
                        <div className="flex gap-4">
                            <div className="px-6 py-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl shadow-sm">
                                <p className="text-xs font-semibold text-emerald-600 mb-1">Bugün Gönderilen</p>
                                <p className="text-3xl font-bold text-emerald-700">{stats.todaySent}</p>
                            </div>
                            <div className="px-6 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                                <p className="text-xs font-semibold text-blue-600 mb-1">Bu Ay</p>
                                <p className="text-3xl font-bold text-blue-700">{stats.monthSent}</p>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* TABS - More spacious */}
            <div className="bg-white border-b border-slate-200 px-8">
                <div className="flex gap-2">
                    {[
                        { id: 'templates', label: 'Template\'ler', icon: FileText, count: templates.length },
                        { id: 'logs', label: 'Mail Logları', icon: BarChart3, count: logs.length },
                        { id: 'stats', label: 'İstatistikler', icon: BarChart3 }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all relative ${
                                activeTab === tab.id
                                    ? 'text-blue-700'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                    {tab.count}
                                </span>
                            )}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT - More spacious */}
            <main className="flex-1 overflow-auto p-8">
                {activeTab === 'templates' && (
                    <TemplateList
                        templates={templates}
                        loading={loading}
                        onEdit={handleEditTemplate}
                        onToggle={handleToggleTemplate}
                        onTest={handleOpenTestModal}
                    />
                )}

                {activeTab === 'logs' && (
                    <EmailLogs
                        logs={logs}
                        loading={loading}
                    />
                )}

                {activeTab === 'stats' && (
                    <EmailStats
                        stats={stats}
                        loading={loading}
                    />
                )}
            </main>

            {/* TEST MODAL */}
            {showTestModal && selectedTemplate && (
                <TestEmailModal
                    template={selectedTemplate}
                    onClose={handleCloseTestModal}
                />
            )}
        </div>
    );
}