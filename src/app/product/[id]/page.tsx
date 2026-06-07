// app/product/[id]/page.tsx
// Server component — generateMetadata burada çalışır
import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://sepyaesarp.com/api";
const SITE_URL = "https://sepyaesarp.com";
const SITE_NAME = "Sepya Eşarp";

async function getProduct(slugOrId: string) {
    try {
        const res = await fetch(`${API_BASE}/products/${slugOrId}`, {
            next: { revalidate: 3600 } // 1 saatte bir yenile
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id: slugOrId } = await params;
    const product = await getProduct(slugOrId);

    if (!product) {
        return {
            title: "Ürün Bulunamadı",
            robots: { index: false, follow: false },
        };
    }

    const imageUrl = product.imageUrl?.startsWith("http")
        ? product.imageUrl
        : `${SITE_URL}${product.imageUrl}`;

    const canonicalSlug = product.slug || product.id;
    const canonicalUrl = `${SITE_URL}/product/${canonicalSlug}`;

    const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;
    const isOutOfStock = product.stockQuantity === 0;

    const title = `${product.title} | ${product.brand || SITE_NAME}`;
    const description = product.description
        ? product.description.slice(0, 160)
        : `${product.title} - ${product.material || ""} ${product.size || ""}`.trim();

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: SITE_NAME,
            locale: "tr_TR",
            type: "website",
            images: [
                {
                    url: imageUrl,
                    width: 600,
                    height: 800,
                    alt: product.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        other: {
            // JSON-LD için işaret — aşağıda component içinde ekleniyor
            "product:price:amount": String(price),
            "product:price:currency": "TRY",
            "product:availability": isOutOfStock ? "out of stock" : "in stock",
        },
    };
}

export default async function ProductPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: slugOrId } = await params;
    // İlk yüklemede server'dan veriyi al, client'a geç
    const initialProduct = await getProduct(slugOrId);

    return <ProductPageClient slugOrId={slugOrId} initialProduct={initialProduct} />;
}