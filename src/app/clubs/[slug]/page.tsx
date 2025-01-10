import React from 'react';
import { notFound } from 'next/navigation';
import { getGolfClubs } from "@/lib/sanity/getGolfClubs";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";

// Typen für die Props
interface ClubDetailPageProps {
    params: {
        slug: string;
    };
}

// Diese Funktion generiert die statischen Params für alle Clubs
export async function generateStaticParams() {
    const clubs = await getGolfClubs();
    return clubs.map((club) => ({
        slug: club.slug,
    }));
}

// Die eigentliche Seitenkomponente
async function ClubDetailPage({ params }: ClubDetailPageProps) {
    const clubs = await getGolfClubs();
    const club = clubs.find((c) => c.slug === params.slug);

    // Wenn kein Club gefunden wurde, zeige 404
    if (!club) {
        notFound();
    }

    return (
        <>
            <NavigationFrontend />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Bereich */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-dark-green mb-4">
                            {club.title}
                        </h1>

                        {/* Hauptbild */}
                        {club.image && (
                            <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                                <img
                                    src={club.image}
                                    alt={club.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Kontaktinformationen */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-dark-green">
                                    Kontakt
                                </h2>
                                {club.clubWebsite && (
                                    <p>
                                        <strong>Website:</strong>{' '}
                                        <a
                                            href={club.clubWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cta-green hover:underline"
                                        >
                                            {club.clubWebsite}
                                        </a>
                                    </p>
                                )}
                                {club.clubEmail && (
                                    <p>
                                        <strong>E-Mail:</strong>{' '}
                                        <a
                                            href={`mailto:${club.clubEmail}`}
                                            className="text-cta-green hover:underline"
                                        >
                                            {club.clubEmail}
                                        </a>
                                    </p>
                                )}
                                {club.clubTelefon && (
                                    <p>
                                        <strong>Telefon:</strong>{' '}
                                        <a
                                            href={`tel:${club.clubTelefon}`}
                                            className="text-cta-green hover:underline"
                                        >
                                            {club.clubTelefon}
                                        </a>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-dark-green">
                                    Platz-Details
                                </h2>
                                {club.anzahlLoecher && (
                                    <p><strong>Löcher:</strong> {club.anzahlLoecher}</p>
                                )}
                                {club.parGesamt && (
                                    <p><strong>Par:</strong> {club.parGesamt}</p>
                                )}
                                {club.laengeMeter && (
                                    <p><strong>Länge:</strong> {club.laengeMeter}m</p>
                                )}
                                {club.handicapBeschraenkung && (
                                    <p><strong>HCP:</strong> {club.handicapBeschraenkung}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Weitere Sections können hier hinzugefügt werden */}
                </div>
            </main>

            <FooterFrontend />
        </>
    );
}

export default ClubDetailPage;