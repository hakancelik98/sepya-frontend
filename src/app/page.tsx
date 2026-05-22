"use client";
import Hero from "@/components/Hero";
import Brand from "@/components/Brands";
import ProductCard from "@/components/ProductCard";
import Features from "@/components/Features";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";
import ProductSlider from "@/components/ProductSlider";
import ExtraHero from "@/components/ExtraHeroDisplay";

export default function Home() {
    return (
        <main>
            <Hero />
            <ExtraHero />
            <Brand />
            <ProductSlider /> {/* Yeni eklediğimiz yana kayan yapı */}
            <BrandStory />
        </main>
    );
}