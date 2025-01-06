'use client';

import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

export default function GridNavi() {
    return (
        <Menu as="div" className="relative inline-block text-left z-[1000] mt-2">
            <div>
                <Menu.Button
                    className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                    <span className="sr-only">Menü öffnen</span>
                    <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                </Menu.Button>
            </div>

            <Menu.Items
                as="div"
                className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 overflow-visible z-[1050] rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
                <div className="py-1">
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="#"
                                className={`block px-4 py-2 text-sm ${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                }`}
                            >
                                Account-Einstellungen
                            </a>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="#"
                                className={`block px-4 py-2 text-sm ${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                }`}
                            >
                                Support
                            </a>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="#"
                                className={`block px-4 py-2 text-sm ${
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                }`}
                            >
                                Lizenz
                            </a>
                        )}
                    </Menu.Item>
                    <form method="POST">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    type="submit"
                                    className={`block w-full px-4 py-2 text-left text-sm ${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    }`}
                                >
                                    Abmelden
                                </button>
                            )}
                        </Menu.Item>
                    </form>
                </div>
            </Menu.Items>
        </Menu>
    );
}