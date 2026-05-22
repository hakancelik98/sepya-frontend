"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteSettings {
    siteName: string;
    siteTitle: string;
    siteDescription: string;
    logoUrl: string;
    faviconUrl: string;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    businessHours: string;
}

interface SettingsContextType {
    settings: SiteSettings | null;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    // Favicon URL'ini React state'inde güvenle tutuyoruz
    const [currentFavicon, setCurrentFavicon] = useState<string | null>(null);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/settings`);
            if (response.ok) {
                const data = await response.json();
                setSettings(data);

                // Başlığı güncelliyoruz
                if (data.siteTitle) {
                    document.title = data.siteTitle;
                }

                // Favicon URL'ini güvenli bir şekilde hesaplayıp state'e atıyoruz
                if (data.faviconUrl) {
                    const fullFaviconUrl = data.faviconUrl.startsWith('http')
                        ? data.faviconUrl
                        : `${BASE_URL}${data.faviconUrl.startsWith("/") ? data.faviconUrl : `/${data.faviconUrl}`}`;

                    setCurrentFavicon(fullFaviconUrl);
                }
            }
        } catch (error) {
            console.error('Settings yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const refreshSettings = async () => {
        setLoading(true);
        await fetchSettings();
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
            {/*
              Hatalı DOM manipülasyonu (appendChild/remove) yapmak yerine,
              Next.js ve React'in yerel olarak desteklediği <link> etiketini
              doğrudan JSX içinde render ediyoruz.
              React bu sayede head yönetimini kendi kontrolünde tutuyor ve çakışma önleniyor.
            */}
            {currentFavicon && (
                <link rel="icon" type="image/x-icon" href={currentFavicon} />
            )}
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}