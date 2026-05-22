import { Suspense } from "react";
import ShopModule from "./ShopModule";

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-bold">Yükleniyor...</p>
            </div>
        }>
            <ShopModule />
        </Suspense>
    );
}