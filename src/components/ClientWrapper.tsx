"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import Features from "@/components/Features";

function AuthModalWrapper() {
    const { isAuthModalOpen, authModalView, closeAuthModal } = useAuth();
    return (
        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
            initialView={authModalView}
        />
    );
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const mainClass = !mounted ? "pt-0" : "pt-0";

    return (
        <SettingsProvider>
            <AuthProvider>
                <CartProvider>
                    {!isAdminPage && <Header />}

                    <CartDrawer />
                    <AuthModalWrapper />

                    <main className={mainClass}>
                        {children}
                    </main>

                    {!isAdminPage && <Features />}
                    {!isAdminPage && <Footer />}

                    <Toaster position="top-right" />
                </CartProvider>
            </AuthProvider>
        </SettingsProvider>
    );
}