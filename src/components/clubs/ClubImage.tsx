// src/components/clubs/ClubImage.tsx
import { memo } from "react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanityImageBuilder";
import type { ClubImageProps } from "@/types/ClubComponentTypes";

interface SanityAssetObject {
    _type: string;
    asset: {
        _ref: string;
        _type: string;
    };
}

function isSanityImageAsset(src: unknown): src is SanityAssetObject {
    if (!src || typeof src !== "object") return false;
    const assetObj = src as Record<string, unknown>;
    return (
        "_type" in assetObj &&
        assetObj._type === "image" &&
        "asset" in assetObj
    );
}

const ClubImage = memo(function ClubImage({
                                              src,
                                              alt,
                                              className = "",
                                              priority = false,
                                              onError,
                                          }: ClubImageProps) {
    // Sanity-Bild-URL generieren
    const sanityImageUrl =
        src && isSanityImageAsset(src)
            ? urlForImage(src).width(1200).quality(90).url()
            : null;

    if (sanityImageUrl) {
        return (
            <Image
                src={sanityImageUrl}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-300 ${className}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
                quality={90}
                onError={onError}
            />
        );
    }

    // Fallback für normale URLs oder Platzhalterbilder
    const fallbackSrc =
        src && typeof src === "string" && !src.startsWith("image-")
            ? src
            : "/gcl-hero.jpg";

    return (
        <Image
            src={fallbackSrc}
            alt={alt}
            fill
            className={`object-cover transition-opacity duration-300 ${className}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            onError={onError}
        />
    );
});

export default ClubImage;