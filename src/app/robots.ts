// app/robots.ts
import { MetadataRoute } from "next";

const SITE_URL = "https://sepyaesarp.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin",
                    "/api/",
                    "/checkout",
                    "/cart",
                    "/profile",
                    "/reset-password",
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}