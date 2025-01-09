'use client';

import { Menu } from '@headlessui/react';
import {
    EllipsisVerticalIcon,
    HeartIcon,
    BookmarkIcon,
    PencilSquareIcon,
} from '@heroicons/react/20/solid';

export default function GridNavi() {
    return (
        <Menu as="div" className="relative inline-block text-left z-[1000] mt-0">
            <div>
                <Menu.Button
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-white text-dark-green hover:text-dark-green focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2 focus:ring-offset-white"
                >
                    <span className="sr-only">Menü öffnen</span>
                    <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                </Menu.Button>
            </div>

            <Menu.Items
                as="div"
                className="absolute right-0 mt-2 w-72 origin-top-right divide-y divide-dark-green-10 overflow-visible z-[1050] rounded-md bg-white shadow-lg focus:outline-none"
            >
                <div className="py-1">
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="#"
                                className={`flex items-center px-4 py-2 text-sm ${
                                    active
                                        ? 'bg-dark-green-10 text-dark-green'
                                        : 'text-dark-green'
                                }`}
                            >
                                <HeartIcon className="h-5 w-5 text-cta-green mr-2" />
                                zur Wunschliste hinzufügen
                            </a>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="#"
                                className={`flex items-center px-4 py-2 text-sm ${
                                    active
                                        ? 'bg-dark-green-10 text-dark-green'
                                        : 'text-dark-green'
                                }`}
                            >
                                <BookmarkIcon className="h-5 w-5 text-cta-green mr-2" />
                                zur Course List hinzufügen
                            </a>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="#"
                                className={`flex items-center px-4 py-2 text-sm ${
                                    active
                                        ? 'bg-dark-green-10 text-dark-green'
                                        : 'text-dark-green'
                                }`}
                            >
                                <PencilSquareIcon className="h-5 w-5 text-cta-green mr-2" />
                                Ergebniss eintragen
                            </a>
                        )}
                    </Menu.Item>
                </div>
            </Menu.Items>
        </Menu>
    );
}