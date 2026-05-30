"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "@/components/AuthModal";

interface FavoriteButtonProps {
    productId: number;
    isFavorite?: boolean;          // Opsiyonel: dışarıdan kontrol edilebilir
    onToggle?: (e: React.MouseEvent) => void; // Opsiyonel: dışarıdan override edilebilir
    className?: string;
}

export default function FavoriteButton({
                                           productId,
                                           isFavorite: externalIsFavorite,   // Dışarıdan gelen favori state'i
                                           onToggle: externalOnToggle,        // Dışarıdan gelen toggle fonksiyonu
                                           className = ""
                                       }: FavoriteButtonProps) {
    const [internalIsFavorite, setInternalIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Dışarıdan prop geliyorsa onu, yoksa kendi state'ini kullan
    const isFavorite = externalIsFavorite ?? internalIsFavorite;

    useEffect(() => {
        // Sadece dışarıdan kontrol edilmiyorsa API'ye sor
        if (externalIsFavorite === undefined) {
            checkIfFavorite();
        }
    }, [productId, externalIsFavorite]);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

    const checkIfFavorite = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${API_BASE}/favorites/check/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setInternalIsFavorite(data.isFavorite);
            }
        } catch (error) {
            console.error("Favori kontrolü başarısız");
        }
    };

    const internalHandleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem("token");

        if (!token) {
            setIsAuthModalOpen(true);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/favorites/toggle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });

            if (res.ok) {
                const data = await res.json();
                setInternalIsFavorite(data.isFavorite);
            }
        } catch (error) {
            console.error("Favori işlemi başarısız:", error);
        } finally {
            setLoading(false);
        }
    };

    // Dışarıdan onToggle geliyorsa onu kullan, yoksa kendi logic'ini çalıştır
    const handleToggle = externalOnToggle ?? internalHandleToggle;

    return (
        <>
            <motion.button
                onClick={handleToggle}
                disabled={loading}
                whileTap={{ scale: 0.9 }}
                className={`transition-colors disabled:opacity-50 ${className}`}
            >
                <Heart
                    size={18}
                    strokeWidth={1.5}
                    className={`transition-all ${
                        isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                    }`}
                />
            </motion.button>

            <AnimatePresence>
                {isAuthModalOpen && (
                    <AuthModal
                        isOpen={isAuthModalOpen}
                        onClose={() => setIsAuthModalOpen(false)}
                        initialView="login"
                    />
                )}
            </AnimatePresence>
        </>
    );
}