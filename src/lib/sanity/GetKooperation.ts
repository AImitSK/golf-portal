// import { client } from './client';
import sanityClient from "@/lib/sanityClient";

// Alle Kooperationen abrufen
export async function getKooperation() {
    // Fetch alle Kooperationen aus Sanity
    // Slug wird hinzugefügt, um URLs für die Links zu generieren
    const clubs = await sanityClient.fetch(`*[_type == "kooperation"]{
        _type,
        beschreibung,
        logo{
          _type,
          asset{
            _ref,
            _type
          }
        },
        name,
        typ,
        slug // Abruf des Felds "slug"
    }`);

    // Fallback für fehlende Slugs (für ältere oder fehlerhafte Daten)
    return clubs.map((club: any) => ({
        ...club,
        // Sicherstellen, dass slug ein gültiger Wert ist
        slug: club.slug?.current || null
    }));
}

// Einzelne Kooperation basierend auf ihrem Slug abrufen
export async function getKooperationBySlug(slug: string) {
    // Fetch Kooperation basierend auf dem Slug
    const kooperation = await sanityClient.fetch(
        `*[_type == "kooperation" && slug.current == $slug][0]{
          _type,
          beschreibung,
          logo{
            _type,
            asset{
              _ref,
              _type
            }
          },
          name,
          typ,
          slug // Abruf des Felds "slug"
        }`,
        { slug }
    );

    // Sicherheitsprüfung für Abfrageergebnis (falls slug nicht existiert oder falsch ist)
    if (!kooperation) {
        console.error(`Kooperation mit dem Slug "${slug}" wurde nicht gefunden.`);
        return null;
    }

    return {
        ...kooperation,
        slug: kooperation.slug?.current || null // Falls slug fehlt, Fallback zu null
    };
}