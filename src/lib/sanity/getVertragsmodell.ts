// lib/sanity/getVertragsmodell.ts
import sanityClient from "@/lib/sanityClient";
import type { Vertragsmodell } from "@/types/vertragsmodell";

export async function getVertragsmodelle(): Promise<Vertragsmodell[]> {
    return sanityClient.fetch(`
       *[_type == "vertragsmodell"] | order(preis asc) {
           name,
           preis,
           beschreibung,
           isTopPosition,
           "bild": logo.asset->url,
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