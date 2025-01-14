interface Club {
    slug: string;
    title: string;
    adresse: {
        plz: number;
        ort: string;
    };
}

interface KoopClubListProps {
    clubs: Club[];
}

export function KoopClubList({ clubs }: KoopClubListProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Partner Clubs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubs.map((club) => (
                    <a
                        key={club.slug}
                        href={`/clubs/${club.slug}`}
                        className="p-4 rounded-lg border hover:border-green-500 transition-colors"
                    >
                        <h3 className="font-semibold text-gray-900">
                            {club.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {club.adresse.plz} {club.adresse.ort}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
}