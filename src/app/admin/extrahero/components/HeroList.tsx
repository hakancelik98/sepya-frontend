import React from 'react';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { ExtraHero } from '../types';

interface HeroListProps {
    heroes: ExtraHero[];
    onEdit: (hero: ExtraHero) => void;
    onDelete: (id: number) => void;
    onToggleActive: (hero: ExtraHero) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
}

const HeroList: React.FC<HeroListProps> = ({
                                               heroes,
                                               onEdit,
                                               onDelete,
                                               onToggleActive,
                                               onMoveUp,
                                               onMoveDown,
                                           }) => {

    if (!heroes || heroes.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Henüz hero oluşturulmamış
                </h3>
                <p className="text-gray-600">
                    Yeni bir görsel hero ekleyebilirsiniz
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {heroes.map((hero, index) => (
                <div
                    key={hero.id ?? index}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4 p-4">

                        {/* ORDER CONTROLS */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => onMoveUp(index)}
                                disabled={index === 0}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                title="Yukarı taşı"
                            >
                                <GripVertical size={20} />
                            </button>
                            <button
                                onClick={() => onMoveDown(index)}
                                disabled={index === heroes.length - 1}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                title="Aşağı taşı"
                            >
                                <GripVertical size={20} />
                            </button>
                        </div>

                        {/* IMAGE PREVIEW */}
                        <div
                            className="w-48 h-28 rounded-lg bg-cover bg-center flex-shrink-0 relative"
                            style={{
                                backgroundImage: hero.imageUrl
                                    ? `url(${hero.imageUrl})`
                                    : 'none',
                                backgroundColor: hero.backgroundColor || '#1f2937',
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">
                                    {hero.height || '600px'}
                                </span>
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                    {hero.name || 'İsimsiz Hero'}
                                </h3>

                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                    Sıra: {hero.displayOrder}
                                </span>

                                {hero.isActive && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                        Yayında
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onToggleActive(hero)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    hero.isActive ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                                title={hero.isActive ? 'Yayından kaldır' : 'Yayınla'}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        hero.isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>

                            <button
                                onClick={() => onEdit(hero)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Düzenle"
                            >
                                <Edit2 size={18} />
                            </button>

                            <button
                                onClick={() => {
                                    if (hero.id && window.confirm('Bu hero silinsin mi?')) {
                                        onDelete(hero.id);
                                    }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Sil"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeroList;
