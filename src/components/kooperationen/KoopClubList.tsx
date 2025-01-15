import { GolfClub } from "@/types/club-types";

interface KoopClubListProps {
    clubs: GolfClub[];
}

export function KoopClubList({ clubs }: KoopClubListProps) {
    return (
        <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Partner Clubs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubs.map((club) => (
                    <a
                        key={club.slug}
                        href={`/clubs/${club.slug}`}
                        className="flex items-start gap-4 p-4 rounded-lg border hover:border-green-500 transition-colors"
                    >
                        {/* Logo Container */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dark-green/20 bg-white">
                            {club.logo && (
                                <img
                                    src={club.logo}
                                    alt={`${club.title} Logo`}
                                    className="w-full h-full object-contain p-1"
                                />
                            )}
                        </div>

                        {/* Club Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                                {club.title}
                            </h3>
                            {club.adresse && (
                                <p className="text-sm text-gray-600">
                                    {club.adresse.plz} {club.adresse.ort}
                                </p>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}