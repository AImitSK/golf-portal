// lib/sanity/getVertragsmodell.ts
import { createClient } from '@sanity/client';
import type { Vertragsmodell } from "@/types/vertragsmodell";

const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-26',
    useCdn: true,
});

// getVertragsmodell.ts
export async function getVertragsmodelle(): Promise<Vertragsmodell[]> {
    return sanityClient.fetch(`
       *[_type == "vertragsmodell"] | order(preis asc) {
           name,
           preis,
           beschreibung,
           isTopPosition,
           "logoUrl": grafik.asset->url,  // Hier die Änderung
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