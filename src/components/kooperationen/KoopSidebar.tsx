interface KoopSidebarProps {
    gueltigkeitszeitraum?: string;
    website?: string;
    clubCount: number;
    ansprechpartner?: string;
    kontaktEmail?: string;
}

export function KoopSidebar({
                                gueltigkeitszeitraum,
                                website,
                                clubCount,
                                ansprechpartner,
                                kontaktEmail
                            }: KoopSidebarProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Details
                </h3>
                <div className="space-y-4">
                    {gueltigkeitszeitraum && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">
                                Gültigkeitszeitraum
                            </h4>
                            <p className="text-gray-900">
                                {gueltigkeitszeitraum}
                            </p>
                        </div>
                    )}
                    {website && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">
                                Website
                            </h4>
                            <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700"
                            >
                                Zur Website
                            </a>
                        </div>
                    )}
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">
                            Anzahl Partner Clubs
                        </h4>
                        <p className="text-gray-900">
                            {clubCount} Clubs
                        </p>
                    </div>
                </div>
            </div>

            {(ansprechpartner || kontaktEmail) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Kontakt
                    </h3>
                    <div className="space-y-4">
                        {ansprechpartner && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">
                                    Ansprechpartner
                                </h4>
                                <p className="text-gray-900">
                                    {ansprechpartner}
                                </p>
                            </div>
                        )}
                        {kontaktEmail && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">
                                    E-Mail
                                </h4>
                                <a
                                    href={`mailto:${kontaktEmail}`}
                                    className="text-green-600 hover:text-green-700"
                                >
                                    {kontaktEmail}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}