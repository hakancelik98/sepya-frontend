"use client";
import { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

interface PreviewPanelProps {
    htmlContent: string;
    subject: string;
    variables: Record<string, string>;
    device: 'desktop' | 'tablet' | 'mobile';
}

export default function PreviewPanel({ htmlContent, subject, variables, device }: PreviewPanelProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Render HTML with variables replaced
    const renderContent = () => {
        let rendered = htmlContent;

        // Replace all variables
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            rendered = rendered.replace(regex, value);
        });

        // Replace subject variables
        let renderedSubject = subject;
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            renderedSubject = renderedSubject.replace(regex, value);
        });

        return { html: rendered, subject: renderedSubject };
    };

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const { html } = renderContent();

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        doc.open();
        doc.write(html);
        doc.close();
    }, [htmlContent, variables]);

    const deviceWidths = {
        desktop: 'w-full',
        tablet: 'w-[768px] mx-auto',
        mobile: 'w-[375px] mx-auto'
    };

    const { subject: renderedSubject } = renderContent();

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Preview Header - More spacious */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-700">
                        📧 Canlı Önizleme
                    </h3>
                    <button
                        onClick={() => {
                            const { html } = renderContent();
                            const iframe = iframeRef.current;
                            if (iframe) {
                                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                                if (doc) {
                                    doc.open();
                                    doc.write(html);
                                    doc.close();
                                }
                            }
                        }}
                        className="p-2.5 hover:bg-slate-100 rounded-xl transition-all"
                        title="Önizlemeyi Yenile"
                    >
                        <RefreshCw size={16} className="text-slate-600" />
                    </button>
                </div>

                {/* Email Subject Preview - Better styling */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Konu</p>
                    <p className="text-base font-semibold text-slate-900">
                        {renderedSubject || 'Email konusu buraya gelecek...'}
                    </p>
                </div>
            </div>

            {/* Preview Content - More spacious */}
            <div className="flex-1 overflow-auto p-8">
                <div className={`${deviceWidths[device]} transition-all duration-300`}>
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                        {/* Email Client Header Simulation */}
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    A
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Your Company</p>
                                    <p className="text-xs text-slate-500">noreply@yourcompany.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Email Content */}
                        <iframe
                            ref={iframeRef}
                            className="w-full h-[750px] border-0"
                            title="Email Preview"
                            sandbox="allow-same-origin"
                        />
                    </div>

                    {/* Device Info */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-slate-500">
                            {device === 'desktop' && '🖥️ Masaüstü görünümü'}
                            {device === 'tablet' && '📱 Tablet görünümü (768px)'}
                            {device === 'mobile' && '📱 Mobil görünümü (375px)'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}