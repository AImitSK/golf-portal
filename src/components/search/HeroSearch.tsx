// "use client" directive ensures React hooks work correctly
"use client";

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useDebounce } from '@/hooks/useDebounce';
import { searchGolfClubs } from '@/lib/sanity/getGolfClubs';
import { searchKooperationen } from '@/lib/sanity/GetKooperation';
import Link from 'next/link';
import clsx from 'clsx';
import { GolfClub, SearchKooperation, SearchResult } from '@/types/club-types';

const HeroSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'club' | 'kooperation' | 'city' | 'all'>('all');
    const debouncedSearch = useDebounce(searchTerm, 300);

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedSearch.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const [clubs, kooperationen] = await Promise.all([
                    searchGolfClubs(debouncedSearch),
                    searchKooperationen(debouncedSearch),
                ]);

                const clubResults: SearchResult[] = (clubs as GolfClub[]).map((club) => ({
                    id: club.slug,
                    title: club.title,
                    type: 'club',
                    slug: club.slug,
                    subtitle: club.adresse?.ort,
                }));

                const koopResults: SearchResult[] = (kooperationen as SearchKooperation[]).map((koop) => ({
                    id: koop._id,
                    title: koop.name,
                    type: 'kooperation',
                    slug: koop.slug,
                    subtitle: koop.typ,
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

    const filteredResults = results.filter((result) =>
        activeFilter === 'all' ? true : result.type === activeFilter
    );

    return (


        <div className="relative w-full max-w-3xl mx-auto">

            {/* Filter Buttons */}
            <div className="my-4 flex justify-center space-x-4">
                {['club', 'kooperation', 'city'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter as 'club' | 'kooperation' | 'city')}
                        className={clsx(
                            'px-4 py-2 rounded-full text-sm font-medium',
                            activeFilter === filter
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-gray-900 shadow'
                        )}
                    >
                        {filter === 'club' ? 'Clubs' : filter === 'kooperation' ? 'Kooperationen' : 'Städte'}
                    </button>
                ))}
            </div>

            {/* Search Bar Container */}
            <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-full shadow-lg">
                <div className="grid w-full grid-cols-1">
                    <input
                        name="search"
                        type="search"
                        placeholder="Suche nach Clubs, Städten oder Kooperationen..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                        autoComplete="off"
                        className={clsx(
                            'col-start-1 row-start-1 block w-full rounded-full bg-transparent py-3 pl-12 pr-4 text-base outline-none',
                            searchTerm === ''
                                ? 'text-white placeholder:text-white' // Weiß im nicht-angeklickten Zustand
                                : 'text-gray-900 placeholder:text-gray-500', // Grau bei Fokussierung oder Eingabe
                            'focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-500 sm:text-sm'
                        )}
                    />
                    <MagnifyingGlassIcon
                        aria-hidden="true"
                        className={clsx(
                            'pointer-events-none col-start-1 row-start-1 ml-4 size-6 self-center',
                            searchTerm === ''
                                ? 'text-white' // Weiß im nicht-angeklickten Zustand
                                : 'text-gray-500' // Grau bei Fokussierung oder Eingabe
                        )}
                    />
                </div>
            </div>


            {/* Results Dropdown */}
            {isLoading && (
                <div
                    className="absolute top-16 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 max-h-96 overflow-auto z-40 px-4 py-2 text-sm text-gray-500">
                    Suche läuft...
                </div>
            )}

            {filteredResults.length > 0 && (
                <div
                    className="absolute top-16 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 max-h-96 overflow-auto z-40">
                    <div className="py-2">
                        {filteredResults.map((result) => (
                            <Link
                                key={result.id}
                                href={`/${result.type === 'club' ? 'clubs' : 'kooperationen'}/${result.slug}`}
                                className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md mt-1 flex items-center"
                                onClick={() => {
                                    setSearchTerm('');
                                }}
                            >
                                <div className="font-medium">{result.title}</div>
                                {result.subtitle && (
                                    <div className="text-xs text-gray-500 ml-2">{result.subtitle}</div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroSearch;
