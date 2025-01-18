// src/lib/sanity/getWishlist.ts
import sanityClient from '@/lib/sanityClient'

export async function getWishlistByUserId(userId: string) {
    const wishlist = await sanityClient.fetch(`
        *[_type == "wishlist" && user._ref == $userId] {
            _id,
            createdAt,
            notiz,
            "club": club-> {
                _id,
                title,
                "slug": slug.current,
                adresse {
                    ort,
                    plz
                },
                anzahlLoecher,
                parGesamt,
                laengeMeter,
                handicapBeschraenkung,
                courseRating,
                slope
            }
        }
    `, { userId })
    return wishlist
}
