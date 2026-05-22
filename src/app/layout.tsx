import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// İleride SEO metadata eklemek istersen burası en doğru yerdir
export const metadata = {
    title: "Sepya Official",
    description: "Zarif ve Minimalist Seçki",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="tr">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Tüm dinamik arayüz süreçlerini ve providerları güvenli client sarmalında çalıştırıyoruz */}
        <ClientWrapper>
            {children}
        </ClientWrapper>
        </body>
        </html>
    );
}