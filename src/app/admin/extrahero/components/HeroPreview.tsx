import React from 'react';
import { ExtraHero } from '../types';

interface HeroPreviewProps {
    hero: ExtraHero;
}

const HeroPreview: React.FC<HeroPreviewProps> = ({ hero }) => {
    return (
        <div className="w-full">
            <div
                className="rounded-lg overflow-hidden relative bg-cover bg-center flex items-center justify-center"
                style={{
                    height: hero.height || '600px',
                    backgroundImage: hero.imageUrl
                        ? `url(${hero.imageUrl})`
                        : 'none',
                    backgroundColor: hero.backgroundColor || '#1f2937',
                }}
            >
                <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded">
                    Hero Önizleme • {hero.height || '600px'}
                </span>
            </div>
        </div>
    );
};

export default HeroPreview;
