'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
    FlagIcon,
    UserGroupIcon,
    MapPinIcon,
    ExclamationCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useDebounce } from '@/hooks/useDebounce';
import { searchGolfClubs } from '@/lib/sanity/getGolfClubs';
import { searchKooperationen } from '@/lib/sanity/GetKooperation';
import Link from 'next/link';
import { GolfClub, SearchKooperation, SearchResult } from '@/types/club-types';

const filterOptions = [
    { id: 'all', name: 'Alle', icon: CheckCircleIcon, iconColor: 'text-dark-green', bgColor: 'bg-dark-green' },
    { id: 'club', name: 'Clubs', icon: FlagIcon, iconColor: 'text-cta-green', bgColor: 'bg-cta-green' },
    { id: 'kooperation', name: 'Kooperationen', icon: UserGroupIcon, iconColor: 'text-blue-600', bgColor: 'bg-blue-600' },
    { id: 'city', name: 'Städte', icon: MapPinIcon, iconColor: 'text-red-600', bgColor: 'bg-red-600' }
];

const HeroSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'club' | 'kooperation' | 'city' | 'all'>('all');
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

    const handleSearchFocus = () => {
        setIsOpen(true);
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'club':
                return <FlagIcon className="size-5 text-cta-green flex-shrink-0" />;
            case 'kooperation':
                return <UserGroupIcon className="size-5 text-blue-600 flex-shrink-0" />;
            case 'city':
                return <MapPinIcon className="size-5 text-red-600 flex-shrink-0" />;
            default:
                return <CheckCircleIcon className="size-5 text-dark-green flex-shrink-0" />;
        }
    };

    const activeFilterOption = filterOptions.find(option => option.id === activeFilter) || filterOptions[0];
    const ActiveFilterIcon = activeFilterOption.icon;

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Combined Search Input and Filter */}
            <div className="relative w-full">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        className="w-full rounded-xl py-3 pl-12 pr-32 bg-white/80 backdrop-blur text-gray-900 placeholder:text-gray-500 shadow-lg ring-1 ring-gray-900/5 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Suche"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={handleSearchFocus}
                    />
                    <MagnifyingGlassIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400"
                        aria-hidden="true"
                    />

                    {/* Integrated Filter Menu */}
                    <div className="absolute right-2">
                        <Menu as="div" className="relative">
                            <Menu.Button className={`
                inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium 
                ${activeFilterOption.bgColor} text-white
                hover:opacity-90 focus:outline-none
              `}>
                <span className="flex items-center">
                  <ActiveFilterIcon className="size-5 mr-2 text-white" />
                  <span className="hidden sm:inline">{activeFilterOption.name}</span>
                </span>
                                <ChevronDownIcon className="size-5 text-white ml-1" aria-hidden="true" />
                            </Menu.Button>

                            <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {filterOptions.map((option) => (
                                        <Menu.Item key={option.id}>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => setActiveFilter(option.id as typeof activeFilter)}
                                                    className={`${
                                                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                                    } block w-full px-4 py-2 text-left text-sm`}
                                                >
                          <span className="flex items-center">
                            <option.icon className={`size-5 mr-2 ${option.iconColor}`} />
                              {option.name}
                          </span>
                                                </button>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>

                {/* Results Panel */}
                {isOpen && (searchTerm || results.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="px-4 py-3 text-sm text-gray-500">Suche läuft...</div>
                        ) : filteredResults.length > 0 ? (
                            <div className="py-2">
                                {filteredResults.map((result) => (
                                    <Link
                                        key={result.id}
                                        href={`/${result.type === 'club' ? 'clubs' : 'kooperationen'}/${result.slug}`}
                                        className="block px-4 py-2 hover:bg-gray-50 w-full"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="flex items-start gap-3 w-full">
                                            {getIconForType(result.type)}
                                            <div className="flex-1 min-w-0 text-left">
                                                <div className="text-sm font-medium text-gray-900">{result.title}</div>
                                                {result.subtitle && (
                                                    <div className="text-xs text-gray-500">{result.subtitle}</div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : searchTerm && (
                            <div className="px-4 py-10 text-center sm:px-14">
                                <ExclamationCircleIcon className="mx-auto size-6 text-gray-400" aria-hidden="true" />
                                <p className="mt-4 text-sm text-gray-900">
                                    Keine Ergebnisse gefunden.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroSearch;