"use client";
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
};

type AuthContextType = {
    // Modal state
    isAuthModalOpen: boolean;
    authModalView: "login" | "register";
    openAuthModal: (view?: "login" | "register") => void;
    closeAuthModal: () => void;

    // Auth state
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (token: string, user: AuthUser) => void;
    logout: () => void;

    /**
     * Çağır: API'den 401 veya 403 geldiğinde.
     * Token expire olmuşsa state + localStorage temizlenir,
     * login modal otomatik açılır.
     */
    handleAuthError: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<"login" | "register">("login");
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // ── Uygulama açılınca localStorage'dan oku ────────────────────────────────
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            try {
                // Token'ın expire olup olmadığını kontrol et (JWT payload decode)
                const payload = JSON.parse(atob(storedToken.split(".")[1]));
                const isExpired = payload.exp * 1000 < Date.now();

                if (isExpired) {
                    // Token süresi dolmuş → temizle
                    clearAuthStorage();
                } else {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch {
                // Token bozuksa temizle
                clearAuthStorage();
            }
        }
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────

    const clearAuthStorage = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // storage event'ini elle tetikle (Header.tsx dinleyenler için)
        window.dispatchEvent(new Event("storage"));
    };

    // ── Actions ───────────────────────────────────────────────────────────────

    const login = useCallback((newToken: string, newUser: AuthUser) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        window.dispatchEvent(new Event("storage"));
        setToken(newToken);
        setUser(newUser);
    }, []);

    const logout = useCallback(() => {
        clearAuthStorage();
        setToken(null);
        setUser(null);
    }, []);

    /**
     * API'den 401/403 gelince çağrılır.
     * Token expire olmuşsa her şeyi temizler ve login modal'ı açar.
     */
    const handleAuthError = useCallback(() => {
        clearAuthStorage();
        setToken(null);
        setUser(null);
        // Login modal'ı aç
        setAuthModalView("login");
        setIsAuthModalOpen(true);
    }, []);

    // ── Modal ─────────────────────────────────────────────────────────────────

    const openAuthModal = useCallback(
        (view: "login" | "register" = "login") => {
            setAuthModalView(view);
            setIsAuthModalOpen(true);
        },
        []
    );

    const closeAuthModal = useCallback(() => {
        setIsAuthModalOpen(false);
    }, []);

    // ── Context value ─────────────────────────────────────────────────────────

    return (
        <AuthContext.Provider
            value={{
                isAuthModalOpen,
                authModalView,
                openAuthModal,
                closeAuthModal,
                user,
                token,
                isAuthenticated: !!token && !!user,
                login,
                logout,
                handleAuthError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}