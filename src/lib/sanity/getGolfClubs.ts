import { client } from './client';

export async function getGolfClubs() {
    const clubs = await client.fetch(`*[_type == "golfclub"]{
        title,
        "slug": slug.current,
        status,
        "image": titelbild.asset->url,
        logo,
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
        clubWebsite,
        "aktuellesModell": aktuellesModell->{
            name,
            isTopPosition,
            topPositionRank
        },
        anzahlLoecher,
        parGesamt,
        laengeMeter,
        handicapBeschraenkung,
        courseRating,
        slope,
        platztyp,
        besonderheiten,
        mitgliedschaft {
            moeglich,
            schnuppermitgliedschaft
        },
        turniere {
            club,
            gaeste
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
        zahlungsStatus
    }`);

    console.log("Golfclub-Daten aus Sanity:", clubs);

    return clubs;
}