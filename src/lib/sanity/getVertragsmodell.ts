// src/lib/sanity/getVertragsmodell.ts
import sanityClient from "@/lib/sanityClient";

export async function getVertragsmodelle() {
    return sanityClient.fetch(`
        *[_type == "vertragsmodell"] | order(preis asc) {
            name,
            preis,
            beschreibung,
            isTopPosition,
            features[] {
                limit,
                "featureDetails": feature-> {
                    name,
                    beschreibung,
                    typ,
                    icon
                }
            },
            supportLevel,
            stripePriceId
        }
    `);
}