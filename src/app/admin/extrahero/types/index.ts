export interface ExtraHero {
    id?: number;
    name: string;
    isActive: boolean;
    displayOrder: number;

    // Görsel
    imageUrl: string;

    // Layout
    height: string;
    backgroundColor: string;

    linkType: 'NONE' | 'EXTERNAL' | 'CATEGORY' | 'BRAND';
    linkValue: string;
}
