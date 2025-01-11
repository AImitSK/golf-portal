// src/components/frontend-ui/SEO.tsx
import { Metadata } from 'next';

type OpenGraphType =
    | 'article'
    | 'website'
    | 'book'
    | 'profile'
    | 'music.song'
    | 'music.album'
    | 'music.playlist'
    | 'music.radio_station'
    | 'video.movie'
    | 'video.episode'
    | 'video.tv_show'
    | 'video.other';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    type?: OpenGraphType;
}

export function generateMetadata({
                                     title,
                                     description,
                                     keywords = [],
                                     image,
                                     type = 'website'
                                 }: SEOProps): Metadata {
    // Basis-Title und Description
    const metaTitle = title ? `${title} | Course List` : 'Course List';
    const metaDescription = description || 'Entdecke die besten Golfplätze';

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: keywords,
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            images: image ? [image] : [],
            type: type,
            siteName: 'Course List',
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: image ? [image] : [],
        },
        other: {
            'geo.region': 'DE',
            'og:locale': 'de_DE',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}