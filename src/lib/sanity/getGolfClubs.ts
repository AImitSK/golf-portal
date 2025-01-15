// src/lib/sanity/getGolfClubs.ts
import sanityClient from '@/lib/sanityClient'

const CLUB_PROJECTION = `{
    _id,          // ID hinzufügen
    title,
    "slug": slug.current,
    status,
    beschreibung,
    "image": titelbild.asset->url,
    "logo": logo.asset->url,
    bildergalerie[]{
        asset->{
            url
        },
        beschreibung,
        alt
    },
    seo {
        title,
        description,
        keywords
    },
    adresse {
        ort,
        strasse,
        plz,
        land-> {
            name,
            code
        },
        location {
            lat,
            lng,
            alt
        }
    },
    "city": adresse.ort,
    clubEmail,
    clubTelefon,
    uebungsanlagen,
    clubWebsite,
    "aktuellesModell": aktuellesModell->{
        name,
        isTopPosition,
        topPositionRank
    },
    anzahlLoecher,
    schwierigkeitsgrad,
    parGesamt,
    laengeMeter,
    handicapBeschraenkung,
    courseRating,
    slope,
    platztyp,
    besonderheiten,
    mitgliedschaft {
        moeglich,
        schnuppermitgliedschaft,
        aufnahmegebuehr,
        warteliste
    },
    turniere {
        club,
        gaeste,
        rangliste
    },
    "services": {
        "golfschule": services.golfschule,
        "proShop": services.proShop,
        "restaurant": services.restaurant,
        "umkleide": services.umkleide,
        "sanitaeranlagen": services.sanitaeranlagen,
        "leihausruestung": services.leihausruestung,
        "cartVermietung": services.cartVermietung
    },
    vertragsBeginn,
    vertragsEnde,
    zahlungsStatus,
    kooperationen[]->{
        name,
        "slug": slug.current, // Der slug ist hier eingefügt
        "logo": logo.asset->url
    }
}`;

export async function getGolfClubs() {
    const clubs = await sanityClient.fetch(`*[_type == "golfclub"]${CLUB_PROJECTION}`);
    console.log("Golfclub-Daten aus Sanity:", clubs);
    return clubs;
}

export async function getGolfClubBySlug(slug: string) {
    const club = await sanityClient.fetch(
        `*[_type == "golfclub" && slug.current == $slug][0]${CLUB_PROJECTION}`,
        { slug }
    );
    return club;
}

export async function searchGolfClubs(searchTerm: string) {
    try {
        const searchProjection = `{
            _id,
            title,
            "slug": slug.current,
            beschreibung,
            adresse {
                ort,
                plz
            },
            "image": titelbild.asset->url
        }`;

        const clubs = await sanityClient.fetch(
            `*[_type == "golfclub" && status != "draft" && (
                title match $searchTerm ||
                adresse.ort match $searchTerm ||
                beschreibung match $searchTerm
            )]${searchProjection} | order(score) [0...10]`,
            { searchTerm: `*${searchTerm}*` }
        );

        return clubs;
    } catch (error) {
        console.error('Fehler bei der Club-Suche:', error);
        return [];
    }
}