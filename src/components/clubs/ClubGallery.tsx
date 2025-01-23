// src/components/clubs/ClubGallery.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import type { ClubGalleryProps } from '@/types/club-types';

export function ClubGallery({ images }: ClubGalleryProps) {
    const [open, setOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!images?.length) return null;

    const slides = images.map(img => ({
        src: img.asset.url,
        alt: img.alt || ''
    }));

    return (
        <div className="mb-12">


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {images.map((image, idx) => (
                    <div
                        key={image.asset.url}
                        className="relative aspect-[3/2] overflow-hidden rounded-lg cursor-pointer group"
                        onClick={() => {
                            setCurrentImageIndex(idx);
                            setOpen(true);
                        }}
                    >
                        <Image
                            src={image.asset.url}
                            alt={image.alt || `Golfclub Bild ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        {image.beschreibung && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-sm text-white/90 line-clamp-2">{image.beschreibung}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={currentImageIndex}
                slides={slides}
                thumbnails={{
                    position: "bottom",
                    width: 120,
                    height: 80
                }}
                plugins={[Thumbnails]}
            />
        </div>
    );
}