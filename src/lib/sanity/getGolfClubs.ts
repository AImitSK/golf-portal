// src/lib/sanity/getGolfClubs.ts
import sanityClient from '@/lib/sanityClient'

export async function getGolfClubs() {
    const clubs = await sanityClient.fetch(`*[_type == "golfclub"]{
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
            "logo": logo.asset->url
        }
    }`);

    console.log("Golfclub-Daten aus Sanity:", clubs);
    return clubs;
}

export async function getGolfClubBySlug(slug: string) {
    const club = await sanityClient.fetch(
        `*[_type == "golfclub" && slug.current == $slug][0]{
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
            }
        }`,
        { slug }
    );

    return club;
}