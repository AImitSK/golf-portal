// src/app/api/rounds/[roundId]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import sanityClient from '@/lib/sanityClient';

export async function DELETE(
    request: Request,
    { params }: { params: { roundId: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const round = await sanityClient.fetch(
            `*[_type == "playedRound" && _id == $roundId && user._ref == $userId][0]`,
            { roundId: params.roundId, userId: session.user._id }
        );

        if (!round) {
            return new NextResponse('Not Found', { status: 404 });
        }

        await sanityClient.delete(params.roundId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting round:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}