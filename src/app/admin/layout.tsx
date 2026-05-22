"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!user || user.role !== "ADMIN") {
            router.replace("/404");
            setAuthorized(false);
        } else {
            setAuthorized(true);
        }
    }, []);

    if (authorized === null) {
        return null; // ⛔ Hiçbir şey render etme
    }

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}