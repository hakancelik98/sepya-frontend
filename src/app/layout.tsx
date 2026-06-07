import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import Features from "@/components/Features";
import type { Metadata } from "next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://sepyaesarp.com";
const SITE_NAME = "Sepya Eşarp";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} | Zarif İpek & Şal Koleksiyonu`,
        template: `%s | ${SITE_NAME}`,
    },
    description: "Türkiye'nin en zarif ipek eşarp, şal ve fular koleksiyonu. LaBoutique, Armine ve daha fazlası. Ücretsiz kargo, 14 gün iade.",
    keywords: ["ipek eşarp", "şal", "fular", "başörtü", "LaBoutique", "Armine", "eşarp", "ipek şal", "armine", "samsun",
    "samsun eşarp", "samsun şal", "samsun fular", "samsun başörtü", "samsun ipek eşarp", "samsun ipek şal", "samsun ipek fular", "samsun ipek başörtü"],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} | Zarif İpek & Şal Koleksiyonu`,
        description: "Türkiye'nin en zarif ipek eşarp, şal ve fular koleksiyonu.",
        images: [
            {
                url: `${SITE_URL}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} | Zarif İpek & Şal Koleksiyonu`,
        description: "Türkiye'nin en zarif ipek eşarp, şal ve fular koleksiyonu.",
        images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: {
        canonical: SITE_URL,
    },
    verification: {
        google: "grQT9vvt-mSJEsFo20e75fMY8NVjTXzLpStF3FOd3Bg",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="tr">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientWrapper>
            {children}
            {/* Features server component olarak burada — ClientWrapper hydration'ını beklemez */}
            <Features />
        </ClientWrapper>
        </body>
        </html>
    );
}