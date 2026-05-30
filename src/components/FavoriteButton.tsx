"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface FavoriteButtonProps {
    productId: number;
    isFavorite: boolean;
    onToggle: (productId: number) => void;
    loading?: boolean;
    className?: string;
}

export default function FavoriteButton({
                                           productId,
                                           isFavorite,
                                           onToggle,
                                           loading = false,
                                           className = ""
                                       }: FavoriteButtonProps) {
    return (
        <motion.button
            onClick={() => onToggle(productId)}
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
    );
}