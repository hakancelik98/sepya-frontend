"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function useProducts() {
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);

    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) return allProducts;

        const term = searchTerm.toLowerCase();
        return allProducts.filter(p =>
            p.title?.toLowerCase().includes(term) ||
            p.sku?.toLowerCase().includes(term) ||
            p.category?.name?.toLowerCase().includes(term) ||
            p.color?.toLowerCase().includes(term) ||
            p.brand?.toLowerCase().includes(term)
        );
    }, [allProducts, searchTerm]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [prodRes, catRes, brandRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/products`),
                axios.get(`${API_BASE_URL}/categories`),
                axios.get(`${API_BASE_URL}/brands`)
            ]);
            setAllProducts(prodRes.data);
            setCategories(catRes.data);
            setBrands(brandRes.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Veri yüklenirken hata oluştu");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllData(); }, [fetchAllData]);

    /**
     * Varyantlarla birlikte ürün oluşturma
     * @param productDTO - DTO objesi
     * @param files - Tüm görsel dosyaları
     */
    const handleSubmit = async (productDTO: any, files: File[]) => {
        setLoading(true);
        setError(null);

        const isEdit = !!productDTO.id;

        try {
            console.log("=== FRONTEND SUBMIT DEBUG ===");
            console.log("MODE:", isEdit ? "UPDATE" : "CREATE");
            console.log("ProductDTO:", productDTO);
            console.log("Files count:", files.length);

            const formData = new FormData();
            formData.append("product", JSON.stringify(productDTO));

            files.forEach((file) => {
                formData.append("images", file);
            });

            const url = isEdit
                ? `${API_BASE_URL}/products/${productDTO.id}`
                : `${API_BASE_URL}/products`;

            const method = isEdit ? "put" : "post";

            console.log("Sending to:", url);
            console.log("Method:", method.toUpperCase());

            const response = await axios({
                method,
                url,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("Response:", response.data);

            await fetchAllData();

            alert(
                isEdit
                    ? "Ürün başarıyla güncellendi"
                    : `Başarılı! ${response.data.count || 1} ürün oluşturuldu`
            );

            return true;
        } catch (err: any) {
            console.error("=== FRONTEND SUBMIT ERROR ===");
            console.error("Status:", err.response?.status);
            console.error("Data:", err.response?.data);

            const errorMsg =
                err.response?.data?.message ||
                err.message ||
                "İşlem sırasında hata oluştu";

            setError(errorMsg);
            alert(`Hata: ${errorMsg}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${API_BASE_URL}/products/${id}`);
            await fetchAllData();
        } catch (err: any) {
            setError(err.response?.data?.message || "Silme işlemi başarısız");
            console.error("Delete error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicate = async (p: any) => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${API_BASE_URL}/products/${p.id}/duplicate`);
            await fetchAllData();
        } catch (err: any) {
            setError(err.response?.data?.message || "Kopyalama işlemi başarısız");
            console.error("Duplicate error:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        categories,
        brands,
        allProducts,
        filteredProducts,
        searchTerm,
        setSearchTerm,
        handleSubmit,
        handleDelete,
        handleDuplicate
    };
}