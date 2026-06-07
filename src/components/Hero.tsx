// components/Hero.tsx
// Server component — hero verisini server'da çeker, görsel URL'i HTML'e gömülür
// Bu sayede tarayıcı görseli <link rel="preload"> ile anında başlatır → LCP düşer

import HeroClient from "./HeroClient";

const API_BASE   = process.env.NEXT_PUBLIC_API_URL;
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_URL || "https://sepyaesarp.com";

async function getHeroConfig() {
    try {
        const res = await fetch(`${API_BASE}/hero`, {
            next: { revalidate: 300 } // 5 dakikada bir güncelle
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export default async function Hero() {
    const config = await getHeroConfig();

    const bgImage = config?.imageUrl
        ? config.imageUrl.startsWith("http")
            ? config.imageUrl
            : `${ASSET_BASE}${config.imageUrl}`
        : null;

    return <HeroClient config={config} bgImage={bgImage} />;
}