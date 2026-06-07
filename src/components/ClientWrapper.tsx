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
// FIX: Features layout.tsx'e taşındı — server component olarak render edilir, CLS önlenir

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

    return (
        <SettingsProvider>
            <AuthProvider>
                <CartProvider>
                    {!isAdminPage && <Header />}
                    <CartDrawer />
                    <AuthModalWrapper />
                    <main className="pt-0">
                        {children}
                    </main>
                    {/* FIX: Features burada değil, layout.tsx'te server component olarak */}
                    {!isAdminPage && <Footer />}
                    <Toaster position="top-right" />
                </CartProvider>
            </AuthProvider>
        </SettingsProvider>
    );
}