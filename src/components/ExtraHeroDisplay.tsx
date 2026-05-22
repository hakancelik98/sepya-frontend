"use client";

import { useEffect, useState } from "react";
import { ExtraHero } from "@/app/admin/extrahero/types";
import { heroService } from "@/app/admin/extrahero/services/heroService";
import Link from "next/link"; // Next.js Link bileşenini ekle

export default function ExtraHeroDisplay() {
    const [heroes, setHeroes] = useState<ExtraHero[]>([]);

    useEffect(() => {
        heroService.getActive().then(setHeroes).catch(console.error);
    }, []);

    if (heroes.length === 0) return null;

    // Link oluşturma mantığı
    const getBannerHref = (hero: ExtraHero) => {
        if (!hero.linkType || hero.linkType === 'NONE') return null;

        switch (hero.linkType) {
            case 'EXTERNAL': return hero.linkValue;
            case 'CATEGORY': return `/shop?category=${hero.linkValue}`;
            case 'BRAND':    return `/shop?brand=${hero.linkValue}`;
            default: return '/shop';
        }
    };

    return (
        <>
            {heroes.map(hero => {
                const href = getBannerHref(hero);

                const BannerContent = (
                    <section
                        key={hero.id}
                        className={`w-full bg-cover bg-center ${href ? 'cursor-pointer' : ''}`}
                        style={{
                            height: hero.height,
                            backgroundImage: hero.imageUrl ? `url(${hero.imageUrl})` : "none",
                            backgroundColor: hero.backgroundColor || "#000",
                        }}
                    />
                );

                // Eğer link varsa Link ile sar, yoksa düz render et
                return href ? (
                    <Link
                        key={hero.id}
                        href={href}
                        target={hero.linkType === 'EXTERNAL' ? "_blank" : "_self"}
                    >
                        {BannerContent}
                    </Link>
                ) : BannerContent;
            })}
        </>
    );
}