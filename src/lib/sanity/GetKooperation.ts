// src/lib/sanity/GetKooperation.ts
import sanityClient from "@/lib/sanityClient";

const KOOPERATION_QUERY = `{
    _type,
    _id,
    name,
    beschreibung,
    typ,
    "slug": slug.current,
    "logo": logo.asset->url,
    website,
    gueltigkeitszeitraum,
    ansprechpartner,
    kontaktEmail,
    "clubs": *[_type == "golfclub" && references(^._id)]{
        title,
        "slug": slug.current,
        adresse{
            strasse,
            hausnummer,
            plz,
            ort,
            location{
                lat,
                lng
            }
        }
    }
}`;

/**
 * Holt alle Kooperationen aus der Datenbank
 */
export async function getKooperation() {
    try {
        const kooperationen = await sanityClient.fetch(
            `*[_type == "kooperation"]${KOOPERATION_QUERY}`
        );

        console.log("Alle Kooperationen:", kooperationen);
        return kooperationen;
    } catch (error) {
        console.error('Fehler beim Abrufen aller Kooperationen:', error);
        throw error;
    }
}

/**
 * Holt eine spezifische Kooperation anhand ihres Slugs
 */
export async function getKooperationBySlug(slug: string) {
    try {
        const kooperation = await sanityClient.fetch(
            `*[_type == "kooperation" && slug.current == $slug][0]${KOOPERATION_QUERY}`,
            { slug }
        );

        if (!kooperation) {
            console.error(`Kooperation mit dem Slug "${slug}" wurde nicht gefunden.`);
            return null;
        }

        console.log("Gefundene Kooperation:", kooperation);
        return kooperation;
    } catch (error) {
        console.error('Fehler beim Abrufen der Kooperation:', error);
        throw error;
    }
}

/**
 * Holt alle Kooperationen eines spezifischen Typs
 */
export async function getKooperationByType(typ: string) {
    try {
        const kooperationen = await sanityClient.fetch(
            `*[_type == "kooperation" && typ == $typ]${KOOPERATION_QUERY}`,
            { typ }
        );

        return kooperationen;
    } catch (error) {
        console.error(`Fehler beim Abrufen der Kooperationen vom Typ "${typ}":`, error);
        throw error;
    }
}