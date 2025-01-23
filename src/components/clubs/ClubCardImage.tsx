// src/components/clubs/ClubCardImage.tsx
import { memo } from 'react';
import Link from 'next/link';
import ClubImage from './ClubImage';
import type { ClubCardImageProps } from '@/types/ClubComponentTypes';

const ClubCardImage = memo(function ClubCardImage({
                                                      slug,
                                                      image,
                                                      title,
                                                      isLarge
                                                  }: ClubCardImageProps) {
    const className = isLarge
        ? "block relative w-full aspect-[16/9] lg:aspect-[32/9] overflow-hidden rounded-2xl"
        : "block shrink-0 w-[120px] h-[120px] relative rounded-lg overflow-hidden";

    return (
        <Link href={`/clubs/${slug}`} className={className}>
            <ClubImage
                src={image || '/gcl-hero.jpg'}
                alt={title || 'Club Vorschau'}
                priority={isLarge}
                className="object-cover"
            />
        </Link>
    );
});

export default ClubCardImage;