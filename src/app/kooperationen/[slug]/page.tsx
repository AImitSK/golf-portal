// src/app/kooperationen/[slug]/page.tsx
import { getKooperationBySlug, getKooperation } from "@/lib/sanity/GetKooperation";
import { notFound } from "next/navigation";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import MapClientWrapper from "@/components/kooperationen/MapClientWrapper";
import { KoopHero } from "@/components/kooperationen/KoopHero";
import { KoopDescription } from "@/components/kooperationen/KoopDescription";
import { KoopClubList } from "@/components/kooperationen/KoopClubList";
import { KoopSidebar } from "@/components/kooperationen/KoopSidebar";
import { Metadata } from "next";

interface PageProps {
    params: {
        slug: string;
    };
}

// Diese Funktion generiert die statischen Routen für alle Kooperationen
export async function generateStaticParams() {
    try {
        const kooperationen = await getKooperation();
        return kooperationen.map((koop: any) => ({
            slug: koop.slug || "",
        }));
    } catch (error) {
        console.error('Fehler beim Generieren der statischen Params:', error);
        return [];
    }
}

// Dynamische Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const kooperation = await getKooperationBySlug(params.slug);

        if (!kooperation) {
            return {
                title: 'Kooperation nicht gefunden',
            };
        }

        return {
            title: kooperation.name,
            description: kooperation.beschreibung?.slice(0, 160),
        };
    } catch (error) {
        console.error('Fehler beim Generieren der Metadata:', error);
        return {
            title: 'Kooperationen',
        };
    }
}

export default async function KooperationPage({ params }: PageProps) {
    try {
        const kooperation = await getKooperationBySlug(params.slug);

        if (!kooperation) {
            return notFound();
        }

        return (
            <>
                <NavigationFrontend />

                <KoopHero
                    name={kooperation.name}
                    typ={kooperation.typ}
                    logo={kooperation.logo}
                />

                <main className="max-w-[1280px] mx-auto px-4 py-12 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <KoopDescription beschreibung={kooperation.beschreibung} />

                            {kooperation.clubs && kooperation.clubs.length > 0 && (
                                <>
                                    <div className="bg-white rounded-lg shadow-sm p-8">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                            Partner Standorte
                                        </h2>
                                        <MapClientWrapper
                                            clubs={kooperation.clubs}
                                            kooperationName={kooperation.name}
                                        />
                                    </div>

                                    <KoopClubList clubs={kooperation.clubs} />
                                </>
                            )}
                        </div>

                        <KoopSidebar
                            gueltigkeitszeitraum={kooperation.gueltigkeitszeitraum}
                            website={kooperation.website}
                            clubCount={kooperation.clubs?.length || 0}
                            ansprechpartner={kooperation.ansprechpartner}
                            kontaktEmail={kooperation.kontaktEmail}
                        />
                    </div>
                </main>

                <FooterFrontend />
            </>
        );
    } catch (error) {
        console.error('Fehler beim Rendern der Kooperationsseite:', error);
        return notFound();
    }
}