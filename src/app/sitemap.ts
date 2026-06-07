// app/sitemap.ts
import { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://sepyaesarp.com/api";
const SITE_URL = "https://sepyaesarp.com";

async function getProducts() {
    try {
        const res = await fetch(`${API_BASE}/products?all=true`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

async function getCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    // Statik sayfalar
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/shop`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Kategori sayfaları
    const categoryPages: MetadataRoute.Sitemap = (Array.isArray(categories) ? categories : [])
        .map((cat: any) => ({
            url: `${SITE_URL}/shop?category=${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

    // Ürün sayfaları
    const productPages: MetadataRoute.Sitemap = (Array.isArray(products) ? products : [])
        .filter((p: any) => p.slug || p.id)
        .map((p: any) => ({
            url: `${SITE_URL}/product/${p.slug || p.id}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

    return [...staticPages, ...categoryPages, ...productPages];
}