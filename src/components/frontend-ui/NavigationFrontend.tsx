"use client";

import { Menu } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';

export default function NavigationWithHamburger() {
    return (
        <nav className="sticky top-0 z-20 bg-dark-green w-full">
            <div className="mx-auto max-w-[1280px] px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Logo mit Link */}
                    <div className="flex items-center px-2">
                        <div className="shrink-0">
                            <Link href="/">
                                <img
                                    alt="Logo"
                                    src="/logo_course_list.svg"
                                    className="h-8 w-auto"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-1 justify-center px-2">
                        <SearchBar />
                    </div>

                    {/* Menu Button */}
                    <div className="flex items-center pl-2">
                        <Menu as="div" className="relative">
                            <Menu.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-dark-green-10 hover:bg-dark-green hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="size-6" aria-hidden="true" />
                            </Menu.Button>

                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/clubs"
                                                className={`block px-4 py-2 text-sm text-dark-green ${
                                                    active ? 'bg-gray-100' : ''
                                                }`}
                                            >
                                                Golfclubs
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/kooperationen"
                                                className={`block px-4 py-2 text-sm text-dark-green ${
                                                    active ? 'bg-gray-100' : ''
                                                }`}
                                            >
                                                Kooperationen
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/pricing"
                                                className={`block px-4 py-2 text-sm text-dark-green ${
                                                    active ? 'bg-gray-100' : ''
                                                }`}
                                            >
                                                Pricing
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
}