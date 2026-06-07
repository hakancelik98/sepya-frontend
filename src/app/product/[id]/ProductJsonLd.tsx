// app/product/[id]/ProductJsonLd.tsx
const SITE_URL = "https://sepyaesarp.com";
const SITE_NAME = "Sepya Eşarp";

export default function ProductJsonLd({
                                          product,
                                          imageUrl,
                                      }: {
    product: any;
    imageUrl: string;
}) {
    const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;
    const isOutOfStock = product.stockQuantity === 0;
    const canonicalUrl = `${SITE_URL}/product/${product.slug || product.id}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description || product.title,
        image: imageUrl,
        sku: product.sku,
        brand: {
            "@type": "Brand",
            name: product.brand || SITE_NAME,
        },
        offers: {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "TRY",
            price: String(price),
            availability: isOutOfStock
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: SITE_NAME,
            },
        },
        ...(product.material && {
            material: product.material,
        }),
        ...(product.size && {
            size: product.size,
        }),
        ...(product.color && {
            color: product.color,
        }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}