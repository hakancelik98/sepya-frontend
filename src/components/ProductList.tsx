"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductList() {
    const [products, setProducts] = useState([]);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${BASE_URL}/products`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Veri çekme hatası:", err));
    }, []);

    return (
        /* ! ÖNEMLİ: grid-cols-2 yazmalı, grid-cols-1 asla olmamalı */
        <div className="w-full max-w-[1500px] mx-auto min-h-screen">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 p-2 md:p-10">
                {products.map((product: any) => (
                    <ProductCard
                        key={product.id}
                        {...product}
                    />
                ))}
            </div>
        </div>
    );
}