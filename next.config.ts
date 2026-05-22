import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // 1. Build sırasında TypeScript ve ESLint hatalarını görmezden gel
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // 2. Mevcut görsel ayarlarınız (Lokal + Sunucu IP desteği eklenmiş hali)
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/*.jpg',
            },
            {
                protocol: 'http',
                hostname: '85.10.135.107',
                port: '8080',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: '85.10.135.107',
                port: '8080',
                pathname: '/*.jpg',
            }
        ],
    },
};

export default nextConfig;