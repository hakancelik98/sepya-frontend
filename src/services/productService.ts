// services/productService.ts veya app/products/_services/productService.ts
// Misafir sepeti için ürün bilgilerini çekmek amacıyla

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface Product {
    id: number;
    title: string;
    imageUrl: string;
    price: number;
    discountedPrice: number | null;
    stockQuantity: number;
    category: string | { id: number; name: string; slug: string; imageUrl: string };
}

export const productService = {
    // Tek ürün getir
    async getProductById(productId: number): Promise<Product> {
        const res = await fetch(`${API_URL}/products/${productId}`);

        if (!res.ok) {
            throw new Error(`Ürün bulunamadı: ${productId}`);
        }

        return res.json();
    },

    // Birden fazla ürünü toplu getir (performans için)
    async getProductsByIds(productIds: number[]): Promise<Product[]> {
        if (productIds.length === 0) return [];

        // Backend'de batch endpoint varsa kullan, yoksa tek tek çek
        try {
            // Önce batch endpoint dene
            const res = await fetch(`${API_URL}/products/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: productIds })
            });

            if (res.ok) {
                return res.json();
            }
        } catch (error) {
            console.log('Batch endpoint yok, tek tek çekilecek');
        }

        // Batch endpoint yoksa tek tek çek
        const promises = productIds.map(id => this.getProductById(id));
        return Promise.all(promises);
    }
};