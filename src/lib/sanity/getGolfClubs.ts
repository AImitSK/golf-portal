// src/lib/sanity/getGolfClubs.ts
import { client } from './client';

export async function getGolfClubs() {
    const clubs = await client.fetch(`*[_type == "golfclub"]{
        title,
        "image": titelbild.asset->url, // Bild des Clubs
        clubEmail,                    // Kontakt E-Mail
        clubTelefon,                  // Telefonnummer
        clubWebsite,                  // Webseite
        "city": adresse.ort,          // Standort/Adresse des Clubs

        // Vertragsmodell
        "aktuellesModell": aktuellesModell->{
            name,                     // Modellname (z.B. "premium")
            isTopPosition,            // Ist auf Top-Position
            topPositionRank           // Rang der Top-Position
        },
        
        // Weitere Attribute
        anzahlLoecher,                // Anzahl der Löcher
        parGesamt,                    // Gesamtes Par
        laengeMeter,                  // Gesamtlänge in Meter
        handicapBeschraenkung,        // Einschränkendes Handicap
        courseRating,                 // Course Rating
        slope,                        // Slope-Wert
        
        // Tagging oder Klassifizierungen
        platztyp,                     // Platztyp (z.B. "Mountain Course")
        besonderheiten,               // Besondere Merkmale (z.B. Bunker, Seen, etc.)

        // Services
        "services": {
            "golfschule": services.golfschule,
            "proShop": services.proShop,
            "restaurant": services.restaurant,
            "umkleide": services.umkleide,
            "sanitaeranlagen": services.sanitaeranlagen,
            "leihausruestung": services.leihausruestung,
            "cartVermietung": services.cartVermietung
        }
    }`);

    // DEBUG: Prüfen Sie die geladenen Daten
    console.log("Golfclubs-Daten aus Sanity:", clubs);

    return clubs;
}