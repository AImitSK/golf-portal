'use client';
// src/components/search/SearchBar.tsx
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useDebounce } from '@/hooks/useDebounce';
import { searchGolfClubs } from '@/lib/sanity/getGolfClubs';
import { searchKooperationen } from '@/lib/sanity/GetKooperation';
import Link from 'next/link';

// Typen für die Suchergebnisse
interface SearchClub {
    _id: string;
    title: string;
    slug: string;
    adresse: {
        ort: string;
        plz: string;
    };
}

interface SearchKooperation {
    _id: string;
    name: string;
    slug: string;
    typ: string;
}

type SearchResult = {
    id: string;
    title: string;
    type: 'club' | 'kooperation';
    slug: string;
    subtitle?: string;
};

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, 300);

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedSearch.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                // Parallel Suche in beiden Kategorien
                const [clubs, kooperationen] = await Promise.all([
                    searchGolfClubs(debouncedSearch),
                    searchKooperationen(debouncedSearch)
                ]);

                const clubResults: SearchResult[] = (clubs as SearchClub[]).map(club => ({
                    id: club._id,
                    title: club.title,
                    type: 'club',
                    slug: club.slug,
                    subtitle: club.adresse.ort
                }));

                const koopResults: SearchResult[] = (kooperationen as SearchKooperation[]).map(koop => ({
                    id: koop._id,
                    title: koop.name,
                    type: 'kooperation',
                    slug: koop.slug,
                    subtitle: koop.typ
                }));

                setResults([...clubResults, ...koopResults]);
            } catch (error) {
                console.error('Fehler bei der Suche:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedSearch]);

    return (
        <div className="relative w-full max-w-3xl"> {/* Geändert von max-w-lg zu max-w-3xl */}
            <div className="grid w-full grid-cols-1">  {/* max-w-lg entfernt */}
                <input
                    name="search"
                    type="search"
                    placeholder="Suche nach Clubs oder Kooperationen..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="col-start-1 row-start-1 block w-full rounded-md bg-dark-green-10 py-1.5 pl-10 pr-3 text-base text-dark-green outline-none placeholder:text-dark-green-25 focus:bg-dark-green-10 focus:text-dark-green focus:placeholder:text-dark-green-25 sm:text-sm/6"
                />
                <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-dark-green-25"
                />
            </div>


            {/* Suchergebnisse Dropdown */}
            {isOpen && (searchTerm.length >= 2 || results.length > 0) && (
                <div
                    className="absolute mt-2 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 max-h-96 overflow-auto z-50"
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <div className="py-2">
                        {isLoading ? (
                            <div className="px-4 py-2 text-sm text-gray-500">
                                Suche läuft...
                            </div>
                        ) : results.length > 0 ? (
                            <>
                                {/* Golfclubs Sektion */}
                                {results.some(r => r.type === 'club') && (
                                    <div className="px-4 py-2">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase">Golfclubs</h3>
                                        {results
                                            .filter(r => r.type === 'club')
                                            .map(result => (
                                                <Link
                                                    key={result.id}
                                                    href={`/clubs/${result.slug}`}
                                                    className="block px-4 py-2 text-sm text-dark-green hover:bg-gray-100 rounded-md mt-1"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        setSearchTerm('');
                                                    }}
                                                >
                                                    <div className="font-medium">{result.title}</div>
                                                    {result.subtitle && (
                                                        <div className="text-xs text-gray-500">{result.subtitle}</div>
                                                    )}
                                                </Link>
                                            ))}
                                    </div>
                                )}

                                {/* Kooperationen Sektion */}
                                {results.some(r => r.type === 'kooperation') && (
                                    <div className="px-4 py-2">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase">Kooperationen</h3>
                                        {results
                                            .filter(r => r.type === 'kooperation')
                                            .map(result => (
                                                <Link
                                                    key={result.id}
                                                    href={`/kooperationen/${result.slug}`}
                                                    className="block px-4 py-2 text-sm text-dark-green hover:bg-gray-100 rounded-md mt-1"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        setSearchTerm('');
                                                    }}
                                                >
                                                    <div className="font-medium">{result.title}</div>
                                                    {result.subtitle && (
                                                        <div className="text-xs text-gray-500">{result.subtitle}</div>
                                                    )}
                                                </Link>
                                            ))}
                                    </div>
                                )}
                            </>
                        ) : searchTerm.length >= 2 ? (
                            <div className="px-4 py-2 text-sm text-gray-500">
                                Keine Ergebnisse gefunden
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}