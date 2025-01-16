'use client';

import React from 'react';
import Image from 'next/image'; // Falls Sie Next.js verwenden

const navigation = {
    listen: [
        { name: '100 besten Golfplätze ', href: '#' },
        { name: 'besten Golfplätze Deutschlands', href: '#' },
        { name: 'Golfplatz in der Nähe', href: '#' },
        { name: 'top 10 Golfplätze Deutschland', href: '#' },
        { name: 'bester Greenfee Verbund', href: '#' },
        { name: 'Golfclub Kooperationen', href: '#' },

    ],
    städte: [
        { name: 'Golfplätz Hamburg', href: '#' },
        { name: 'Golfplätz Berlin', href: '#' },
        { name: 'Golfplätz München', href: '#' },
        { name: 'Golfplätz Sylt', href: '#' },
        { name: 'Golfplätz Rostock', href: '#' },
        { name: 'Golfplätz Hannover', href: '#' },
    ],
    Persöhnliches: [
        { name: 'Wunschliste', href: '#' },
        { name: 'Course List', href: '#' },
        { name: 'Scoreboard', href: '#' },
        { name: 'Login', href: '/auth/login' },
    ],
    Allgemein: [
        { name: 'Datenschutz', href: '#' },
        { name: 'Impressum', href: '#' },
        { name: 'Cookie Einstellungen', href: '#' },
        { name: 'Login für Golfplätze', href: '/auth/login' },
        { name: 'Mediadaten', href: '#' },
    ],

};

export default function FooterFrontend() {
    return (
        <footer className="bg-dark-green text-white">
            <div className="container mx-auto max-w-[1280px] py-10 px-10">
                <div className="flex flex-wrap -mx-6">
                    {/* Logo und Beschreibung */}
                    <div className="w-full lg:w-1/5 px-6 mb-6 lg:mb-0">
                        <Image
                            src="/logo_course_list.svg" // Nutzen Sie hier die URL direkt
                            alt="Logo"
                            width={150} // Die Breite des Logos
                            height={50} // Die Höhe des Logos
                            priority
                        />

                    </div>

                    {/* Navigation */}
                    <div className="w-full lg:w-4/5 px-6">
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
                    © {new Date().getFullYear()} course list. Alle Rechte vorbehalten.
                </div>
            </div>
        </footer>
    );
}