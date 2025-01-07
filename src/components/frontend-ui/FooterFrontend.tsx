'use client';

import React from 'react';
import Image from 'next/image'; // Falls Sie Next.js verwenden

const navigation = {
    solutions: [
        { name: 'Marketing', href: '#' },
        { name: 'Analytics', href: '#' },
        { name: 'Automation', href: '#' },
        { name: 'Commerce', href: '#' },
        { name: 'Insights', href: '#' },
    ],
    support: [
        { name: 'Submit ticket', href: '#' },
        { name: 'Documentation', href: '#' },
        { name: 'Guides', href: '#' },
    ],
    company: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Jobs', href: '#' },
        { name: 'Press', href: '#' },
    ],
    legal: [
        { name: 'Terms of service', href: '#' },
        { name: 'Privacy policy', href: '#' },
        { name: 'License', href: '#' },
    ],
    social: [
        {
            name: 'Facebook',
            href: '#',
            icon: (props: React.SVGProps<SVGSVGElement>) => (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        // Weitere soziale Links...
    ],
};

export default function FooterFrontend() {
    return (
        <footer className="bg-dark-green text-white">
            <div className="container mx-auto max-w-[1280px] py-10 px-10">
                <div className="flex flex-wrap -mx-6">
                    {/* Logo und Beschreibung */}
                    <div className="w-full lg:w-1/3 px-6 mb-6 lg:mb-0">
                        <Image
                            src="/logo_course_list.svg" // Nutzen Sie hier die URL direkt
                            alt="Logo"
                            width={150} // Die Breite des Logos
                            height={50} // Die Höhe des Logos
                            priority
                        />
                        <p className="mt-4 text-sm">
                            Willkommen bei unserem Unternehmen. Unser Ziel ist es, innovative Lösungen bereitzustellen, die Ihre Anforderungen übertreffen.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="w-full lg:w-2/3 px-6">
                        <div className="flex flex-wrap justify-between">
                            {Object.entries(navigation).map(([section, links]) => (
                                <div key={section} className="w-1/2 lg:w-1/4 mb-6">
                                    <h3 className="font-medium uppercase text-gray-200">{section}</h3>
                                    <ul className="mt-4 space-y-2">
                                        {links.map((link) => (
                                            <li key={link.name}>
                                                <a
                                                    href={link.href}
                                                    className="text-sm text-gray-300 hover:text-white"
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer-Unterschrift */}
                <div className="mt-10 border-t border-gray-400 pt-4 text-center text-sm text-gray-300">
                    © {new Date().getFullYear()} Ihr Unternehmen. Alle Rechte vorbehalten.
                </div>
            </div>
        </footer>
    );
}