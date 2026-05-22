"use client";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            textColor: 'text-emerald-600',
            iconColor: 'text-emerald-500'
        },
        error: {
            icon: AlertCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-600',
            iconColor: 'text-red-500'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-600',
            iconColor: 'text-amber-500'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-600',
            iconColor: 'text-blue-500'
        }
    };

    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

    return (
        <div className={`fixed top-6 right-6 z-[9999] ${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 min-w-[320px] max-w-md animate-slide-in-right flex items-start gap-3`}>
            <Icon size={20} className={iconColor} />
            <div className="flex-1">
                <p className={`text-[11px] font-bold ${textColor} uppercase tracking-tight leading-relaxed`}>
                    {message}
                </p>
            </div>
            <button
                onClick={onClose}
                className={`${textColor} hover:opacity-70 transition-opacity`}
            >
                <X size={16} />
            </button>
        </div>
    );
}

// Toast container component
export function ToastContainer({ toasts, onRemove }: {
    toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>;
    onRemove: (id: string) => void;
}) {
    return (
        <div className="fixed top-6 right-6 z-[9999] space-y-3">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ transform: `translateY(${index * 10}px)` }}
                    className="transition-all duration-300"
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => onRemove(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}