"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "@/components/AuthModal"; // AuthModal'ın yolunu kontrol edin

interface FavoriteButtonProps {
    productId: number;
    className?: string;
}

export default function FavoriteButton({ productId, className = "" }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Modal state'i

    useEffect(() => {
        checkIfFavorite();
    }, [productId]);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

    const checkIfFavorite = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(
                `${API_BASE}/favorites/check/${productId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setIsFavorite(data.isFavorite);
            }
        } catch (error) {
            console.error("Favori kontrolü başarısız");
        }
    };

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem("token");

        // EĞER TOKEN YOKSA MODALI AÇ
        if (!token) {
            setIsAuthModalOpen(true);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${API_BASE}/favorites/toggle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId })
                }
            );

            if (res.ok) {
                const data = await res.json();
                setIsFavorite(data.isFavorite);
            }
        } catch (error) {
            console.error("Favori işlemi başarısız:", error);
        } finally {
            setLoading(false);
        }
    };

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

            {/* AUTH MODAL BİLEŞENİ */}
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