// src/app/api/likes/status/route.ts
import { NextResponse } from 'next/server';
import sanityClient from '@/lib/sanityClient';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get('clubId');
    const userId = searchParams.get('userId');

    if (!clubId || !userId) {
        return NextResponse.json(
            { error: 'Club ID and User ID are required' },
            { status: 400 }
        );
    }

    try {
        const like = await sanityClient.fetch(
            `*[_type == "like" && club._ref == $clubId && user._ref == $userId][0]`,
            { clubId, userId }
        );

        return NextResponse.json({ hasLiked: !!like });
    } catch (error) {
        console.error('Error fetching like status:', error);
        return NextResponse.json(
            { error: 'Failed to fetch like status' },
            { status: 500 }
        );
    }
}