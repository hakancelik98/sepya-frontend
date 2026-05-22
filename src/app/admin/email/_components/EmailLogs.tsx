"use client";
import { Check, X, Loader2 } from "lucide-react";

interface EmailLogsProps {
    logs: any[];
    loading: boolean;
}

export default function EmailLogs({ logs, loading }: EmailLogsProps) {
    const getStatusBadge = (status: string) => {
        const styles = {
            SENT: "bg-emerald-100 text-emerald-700",
            FAILED: "bg-red-100 text-red-700",
            PENDING: "bg-amber-100 text-amber-700"
        };
        return styles[status as keyof typeof styles] || "bg-slate-100 text-slate-700";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-lg font-bold text-slate-400">Henüz mail gönderilmemiş</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {logs.map((log) => (
                <div key={log.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1 ${getStatusBadge(log.status)}`}>
                                    {log.status === 'SENT' && <Check size={10} />}
                                    {log.status === 'FAILED' && <X size={10} />}
                                    {log.status}
                                </span>
                                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{log.templateCode}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 mb-1">{log.subject}</p>
                            <p className="text-xs text-slate-500">
                                <span className="font-semibold">To:</span> {log.toEmail}
                            </p>
                            {log.errorMessage && (
                                <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded">
                                    <span className="font-semibold">Error:</span> {log.errorMessage}
                                </p>
                            )}
                        </div>
                        <div className="text-right text-[10px] text-slate-400 space-y-1">
                            <p className="font-mono">{new Date(log.createdAt).toLocaleString('tr-TR')}</p>
                            {log.messageId && (
                                <p className="font-mono bg-slate-100 px-2 py-1 rounded">{log.messageId.substring(0, 25)}...</p>
                            )}
                            {log.orderId && (
                                <p className="text-blue-600">Order #{log.orderId}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}