// src/lib/sanity/getGolfClubs.ts
//import { client } from './client';
import sanityClient from '@/lib/sanityClient'

export async function getGolfClubs() {
    return await sanityClient.fetch(`*[_type == "golfclub"]{
        title,
        "image": titelbild.asset->url,
        clubEmail,
        clubTelefon,
        clubWebsite,
        "city": adresse.ort,
        // Vertragsmodell
        "aktuellesModell": aktuellesModell->{
            name,
            isTopPosition,
            topPositionRank
        },
        // Helle Tags
        anzahlLoecher,
        parGesamt,
        laengeMeter,
        handicapBeschraenkung,
        courseRating,
        slope,
        // Grüne Tags
        platztyp,
        besonderheiten
    }`);
}