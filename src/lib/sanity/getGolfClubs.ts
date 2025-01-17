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

// in getGolfClubs.ts

// Interface für die Stadtsuche
interface CitySearchResult {
    city: string;
    location: {
        lat: number;
        lng: number;
    };
}

export async function searchCities(searchTerm: string) {
    try {
        // Hole nur die relevanten Stadt-Informationen
        const cityProjection = `{
            "city": adresse.ort,
            "location": adresse.location{
                lat,
                lng
            }
        }`;

        const cities = await sanityClient.fetch(
            `*[_type == "golfclub" && defined(adresse.ort) && adresse.ort match $searchTerm]${cityProjection}`,
            { searchTerm: `*${searchTerm}*` }
        );

        // Entferne Duplikate und formatiere die Ergebnisse
        const uniqueCities = cities.reduce((acc: CitySearchResult[], curr: any) => {
            if (!acc.some(city => city.city.toLowerCase() === curr.city.toLowerCase())) {
                acc.push({
                    city: curr.city,
                    location: curr.location
                });
            }
            return acc;
        }, []);

        // Sortiere alphabetisch und limitiere auf 10 Ergebnisse
        return uniqueCities
            .sort((a: CitySearchResult, b: CitySearchResult) =>
                a.city.localeCompare(b.city, 'de'))
            .slice(0, 10);
    } catch (error) {
        console.error('Fehler bei der Städtesuche:', error);
        return [];
    }
}