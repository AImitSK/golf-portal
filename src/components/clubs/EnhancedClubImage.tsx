// src/components/clubs/EnhancedClubImage.tsx
import { memo, useState } from 'react';
import type { ClubImageProps } from '@/types/ClubComponentTypes';
import ClubImage from './ClubImage';
import { LoadingImage } from './LoadingImage';
import { ErrorBoundary } from '../common/ErrorBoundary';

const ImageErrorFallback = memo(function ImageErrorFallback() {
    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
            <span className="text-gray-500 text-sm">
                Bild konnte nicht geladen werden
            </span>
        </div>
    );
});

export const EnhancedClubImage = memo(function EnhancedClubImage(props: ClubImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <ErrorBoundary>
            <div className="relative w-full h-full">
                {isLoading && (
                    <LoadingImage className={props.className} />
                )}
                {!hasError && (
                    <ClubImage
                        {...props}
                        onError={handleError}
                        onLoadingComplete={handleLoad}
                    />
                )}
                {hasError && <ImageErrorFallback />}
            </div>
        </ErrorBoundary>
    );
});