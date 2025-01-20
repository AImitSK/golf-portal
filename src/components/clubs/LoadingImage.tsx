// src/components/clubs/LoadingImage.tsx
import { memo } from 'react';

interface LoadingImageProps {
    className?: string;
}

export const LoadingImage = memo(function LoadingImage({ className = '' }: LoadingImageProps) {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
            role="presentation"
            aria-label="Bild wird geladen"
        />
    );
});