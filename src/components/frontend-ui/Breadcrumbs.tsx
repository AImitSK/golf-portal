"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

// Mapping von Pfadslugs zu menschenlesbaren Namen
const PATH_NAMES: { [key: string]: string } = {
    'clubs': 'Golfclubs',
    'kooperationen': 'Kooperationen',
    'pricing': 'Preise',
    'studio': 'Admin Studio'
};

export default function Breadcrumbs() {
    const pathname = usePathname();

    // Nichts anzeigen, wenn wir auf der Startseite sind
    if (pathname === '/') return null;

    // Pfadsegmente extrahieren und bereinigen
    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    // Breadcrumb-Elemente generieren
    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const name = PATH_NAMES[segment] ||
            (segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '));
        const isCurrent = index === pathSegments.length - 1;

        return {
            name,
            href,
            current: isCurrent
        };
    });


    return (
        <nav aria-label="Breadcrumb" className="flex py-2 px-6 max-w-[1280px] mx-auto bg-gray-50">
            <ol role="list" className="flex items-center space-x-4">
                <li>
                    <Link
                        href="/"
                        className="text-gray-400 hover:text-gray-500 uppercase tracking-wide"
                    >
                        <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                        <span className="sr-only">Startseite</span>
                    </Link>
                </li>
                {breadcrumbs.map((page) => (
                    <li key={page.href}>
                        <div className="flex items-center">
                            <ChevronRightIcon
                                aria-hidden="true"
                                className="size-5 shrink-0 text-gray-400 uppercase tracking-wide"
                            />
                            <Link
                                href={page.href}
                                aria-current={page.current ? 'page' : undefined}
                                className={`ml-4 text-sm font-medium  ${
                                    page.current
                                        ? 'text-gray-500 hover:text-gray-700'
                                        : 'text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                {page.name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}