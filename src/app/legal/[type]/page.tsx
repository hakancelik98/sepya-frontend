"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

type LegalType = 'terms' | 'privacy' | 'return';

const titles: Record<LegalType, string> = {
    terms: 'Kullanım Şartları',
    privacy: 'Gizlilik Politikası',
    return: 'İade ve Değişim Politikası'
};

const fieldNames: Record<LegalType, string> = {
    terms: 'termsOfService',
    privacy: 'privacyPolicy',
    return: 'returnPolicy'
};

export default function LegalPage() {
    const params = useParams();
    const type = params?.type as LegalType;

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/settings`);
                if (response.ok) {
                    const data = await response.json();
                    const fieldName = fieldNames[type];
                    setContent(data[fieldName] || '');
                }
            } catch (error) {
                console.error('Error fetching legal content:', error);
            } finally {
                setLoading(false);
            }
        };

        if (type && fieldNames[type]) {
            fetchContent();
        } else {
            setLoading(false);
        }
    }, [type]);

    if (!type || !titles[type]) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-slate-900 mb-4">404</h1>
                    <p className="text-slate-500">Sayfa bulunamadı</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-black mb-4">
                        {titles[type]}
                    </h1>
                    <div className="w-20 h-1 bg-black"></div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-slate-400" />
                    </div>
                ) : content ? (
                    <div className="prose prose-slate prose-headings:font-black prose-headings:uppercase prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline max-w-none">
                        {/* Render HTML content from Quill editor */}
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-sm">
                            Bu sayfa için henüz içerik eklenmemiş.
                        </p>
                        <p className="text-slate-400 text-xs mt-2">
                            İçerik admin panelinden eklenebilir.
                        </p>
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-16 pt-8 border-t border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                        Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                    </p>
                </div>
            </div>

            <style jsx global>{`
                /* Legal page content styling */
                .prose h1 {
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                
                .prose h2 {
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                
                .prose h3 {
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                }
                
                .prose p {
                    margin-bottom: 1rem;
                    line-height: 1.75;
                    color: #475569;
                }
                
                .prose ul, .prose ol {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                
                .prose li {
                    margin-bottom: 0.5rem;
                    color: #475569;
                }
                
                .prose strong {
                    font-weight: 700;
                    color: #0f172a;
                }
                
                .prose a {
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}