// src/lib/sanity/getGolfClubs.ts
import { client } from './client';

export async function getGolfClubs() {
    return await client.fetch(`*[_type == "golfclub"]{
        title,
        "image": titelbild.asset->url,
        clubEmail,
        clubTelefon,
        clubWebsite,
        "city": adresse.ort,
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