import Hero from "@/components/Hero";
import Brand from "@/components/Brands";
import BrandStory from "@/components/BrandStory";
import ProductSlider from "@/components/ProductSlider";
import ExtraHero from "@/components/ExtraHeroDisplay";

export default function Home() {
    return (
        <main>
            {/*
                preconnect: tarayıcıya "bu origin'e bağlanacaksın, şimdiden hazırlan" der.
                Hero fetch'i ~200ms daha erken başlar → LCP düşer.
            */}
            <link
                rel="preconnect"
                href={process.env.NEXT_PUBLIC_API_URL}
            />
            <link
                rel="preconnect"
                href={process.env.NEXT_PUBLIC_ASSET_URL}
            />

            <Hero />
            <ExtraHero />
            <Brand />
            <ProductSlider />
            <BrandStory />
        </main>
    );
}