"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function BrandStory() {
    const [posts, setPosts] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsRes, settingsRes] = await Promise.all([
                    fetch(`${API_URL}/instagram-posts`),
                    fetch(`${API_URL}/brand-story-settings`)
                ]);
                setPosts(await postsRes.json());
                setSettings(await settingsRes.json());
            } catch (error) {
                console.error("Hata:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [API_URL]);

    if (loading) return null;

    return (
        <section className="w-full py-8 bg-white border-y border-zinc-100 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">

                    <div className="w-full lg:w-[380px] flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Instagram size={14} className="text-[#dc2743]" />
                            <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                                {settings?.instagramUsername || "@sepya.atelier"}
                            </span>
                        </div>

                        <div className="flex flex-col mb-4">
                            <h2 className="text-[clamp(1.5rem,6vw,2.25rem)] font-black tracking-tighter text-zinc-950 leading-[1.1] break-words">
                                {settings?.sectionTitle}
                            </h2>
                            <h3 className="text-[clamp(1.5rem,6vw,2.25rem)] font-black tracking-tighter leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] break-words">
                                {settings?.sectionSubtitle}
                            </h3>
                        </div>

                        <div className="flex items-center gap-4 bg-zinc-50/50 p-3 rounded-2xl border border-zinc-100">
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] text-zinc-600 font-medium leading-tight line-clamp-2">
                                    {settings?.description}
                                </p>
                                <p className="text-[10px] font-black text-zinc-900 mt-1 uppercase tracking-tight">
                                    {settings?.followerCountText} {settings?.followerLabel}
                                </p>
                            </div>
                            <a
                                href={settings?.instagramFollowUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
                            >
                                <Instagram size={18} />
                            </a>
                    </div>
                </div>

                <div className="w-full flex-1">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                        {posts.slice(0, 6).map((post, index) => (
                            <motion.a
                                key={post.id || index}
                                href={post.postUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.03 }}
                                className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 border border-zinc-100 group shadow-sm"
                            >
                                <Image
                                    src={
                                        post.imageUrl
                                            ? (post.imageUrl.startsWith("http")
                                                ? post.imageUrl
                                                : `${ASSET_URL}${post.imageUrl}`)
                                            : "/placeholder.jpg"
                                    }
                                    alt="Instagram"
                                    fill
                                    sizes="(max-width: 768px) 30vw, 15vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </motion.a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
</section>
);
}