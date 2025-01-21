"use client";

import { useEffect, useState, useCallback } from "react";
import { Menu } from "@headlessui/react";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Avatar } from "../catalyst-ui-kit/avatar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NavigationWithHamburger() {
    const [isSticky, setIsSticky] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    // Scroll Handler
    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Optimiertes Logout-Handling
    const handleLogout = useCallback(async () => {
        try {
            await signOut({
                callbackUrl: '/',
                redirect: true
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
    }, []);

    const isAdmin = session?.user?.role === 'admin';

    return (
        <nav
            className={`sticky top-0 z-20 w-full bg-dark-green bg-opacity-90 backdrop-blur-md transition-shadow ${
                isSticky ? "shadow-md" : "shadow-none"
            }`}
        >
            <div className="mx-auto max-w-[1280px] px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Logo */}
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

                    {/* Right side navigation items */}
                    <div className="flex items-center gap-4">
                        {status === "loading" ? (
                            // Ladezustand anzeigen
                            <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
                        ) : session?.user ? (
                            // Eingeloggter Zustand - Avatar mit Dropdown
                            <Menu as="div" className="relative">
                                <Menu.Button>
                                    <span className="h-8 w-8 cursor-pointer inline-grid shrink-0 align-middle [--avatar-radius:50%] overflow-hidden rounded-full">
                                        <Avatar
                                            src={session.user.image || undefined}
                                            initials={session.user.name?.[0]}
                                            alt={session.user.name || ''}
                                            className="size-full [&>img]:object-cover [&>img]:w-full [&>img]:h-full"
                                        />
                                    </span>
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/profile"
                                                    className={`block px-4 py-2 text-sm text-dark-green ${
                                                        active ? "bg-gray-100" : ""
                                                    }`}
                                                >
                                                    Profil
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/wunschliste"
                                                    className={`block px-4 py-2 text-sm text-dark-green ${
                                                        active ? "bg-gray-100" : ""
                                                    }`}
                                                >
                                                    Wunschliste
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/courses"
                                                    className={`block px-4 py-2 text-sm text-dark-green ${
                                                        active ? "bg-gray-100" : ""
                                                    }`}
                                                >
                                                    Course Liste
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        {isAdmin && (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/club-backend"
                                                        className={`block px-4 py-2 text-sm text-dark-green ${
                                                            active ? "bg-gray-100" : ""
                                                        }`}
                                                    >
                                                        Administration
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        )}
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`block w-full px-4 py-2 text-left text-sm text-dark-green ${
                                                        active ? "bg-gray-100" : ""
                                                    }`}
                                                >
                                                    Logout
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Menu>
                        ) : (
                            // Ausgeloggter Zustand - Login Button
                            <Link href="/auth/login">
                                <button className="inline-flex items-center rounded-md bg-cta-green px-4 py-2 text-sm font-semibold text-white hover:bg-dark-green hover:ring-2 hover:ring-white">
                                    <UserCircleIcon className="mr-2 h-5 w-5" />
                                    Anmelden
                                </button>
                            </Link>
                        )}

                        {/* Menu Button */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="size-6" aria-hidden="true" />
                            </Menu.Button>

                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/clubs"
                                                className={`block px-4 py-2 text-sm text-dark-green ${
                                                    active ? "bg-gray-100" : ""
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
                                                    active ? "bg-gray-100" : ""
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
                                                    active ? "bg-gray-100" : ""
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