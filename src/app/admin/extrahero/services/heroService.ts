import { ExtraHero } from '../types';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/extra-hero`;

export const heroService = {

    async getAll(): Promise<ExtraHero[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async getActive(): Promise<ExtraHero[]> {
        const response = await fetch(`${API_URL}/active`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async toggleActive(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}/toggle`, {
            method: 'PATCH',
        });
        if (!response.ok) {
            throw new Error('Durum güncellenemedi');
        }
    },

    async save(hero: ExtraHero): Promise<ExtraHero> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hero),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
        }

        return response.json();
    },

    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    },

    async reorder(orderedIds: number[]): Promise<void> {
        const response = await fetch(`${API_URL}/reorder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderedIds),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    },

    // ⚠️ Geçici çözüm – backend upload eklenince sil
    async uploadImage(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },
};