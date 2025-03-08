import React from 'react';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity/image';

interface UserImageProps {
    user: {
        image?: any; // Sanity Image-Objekt
        imageUrl?: string; // Direkte URL (z.B. von OAuth)
        name?: string;
    };
    width?: number;
    height?: number;
    className?: string;
}

export default function UserImage({ user, width = 40, height = 40, className = '' }: UserImageProps) {
    // Standardplatzhalter für Benutzer ohne Bild
    const fallbackImage = '/images/default-avatar.png';

    // Bestimme die Bildquelle in dieser Reihenfolge:
    // 1. Sanity Image-Objekt, falls vorhanden
    // 2. Direkte URL (von OAuth), falls vorhanden
    // 3. Fallback-Bild

    let imageSource = fallbackImage;
    let imageAlt = user?.name || 'User';

    if (user?.image && typeof user.image === 'object') {
        // Sanity Bild verwenden
        imageSource = urlForImage(user.image).width(width).height(height).url();
    } else if (user?.imageUrl && typeof user.imageUrl === 'string') {
        // Direkte URL verwenden
        imageSource = user.imageUrl;
    }

    return (
        <div className={`overflow-hidden rounded-full ${className}`}>
            <Image
                src={imageSource}
                alt={imageAlt}
                width={width}
                height={height}
                className="object-cover w-full h-full"
            />
        </div>
    );
}