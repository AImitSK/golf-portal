import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function NavigationWithHamburger() {
    return (
        <Disclosure as="nav" className="sticky top-0 z-20 bg-dark-green w-full">
            <div className="mx-auto max-w-[1280px] px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center px-2">
                        <div className="shrink-0">
                            <img
                                alt="Logo"
                                src="/logo_course_list.svg"
                                className="h-8 w-auto"
                            />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-1 justify-center px-2">
                        <div className="grid w-full max-w-lg grid-cols-1">
                            <input
                                name="search"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                className="col-start-1 row-start-1 block w-full rounded-md bg-dark-green-10 py-1.5 pl-10 pr-3 text-base text-dark-green outline-none placeholder:text-dark-green-25 focus:bg-dark-green-10 focus:text-dark-green focus:placeholder:text-dark-green-25 sm:text-sm/6"
                            />
                            <MagnifyingGlassIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-dark-green-25"
                            />
                        </div>
                    </div>

                    {/* Hamburger Menu Button - Always Visible */}
                    <div className="flex items-center pl-2">
                        <div className="relative">
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-dark-green-10 hover:bg-dark-green hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                            </DisclosureButton>

                            {/* Menu Panel - Positioned below the button */}
                            <DisclosurePanel className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <DisclosureButton
                                        as="a"
                                        href="#"
                                        className="block px-4 py-2 text-sm text-dark-green hover:bg-gray-100"
                                    >
                                        Dashboard
                                    </DisclosureButton>
                                    <DisclosureButton
                                        as="a"
                                        href="#"
                                        className="block px-4 py-2 text-sm text-dark-green hover:bg-gray-100"
                                    >
                                        Team
                                    </DisclosureButton>
                                    <DisclosureButton
                                        as="a"
                                        href="#"
                                        className="block px-4 py-2 text-sm text-dark-green hover:bg-gray-100"
                                    >
                                        Projects
                                    </DisclosureButton>
                                    <DisclosureButton
                                        as="a"
                                        href="#"
                                        className="block px-4 py-2 text-sm text-dark-green hover:bg-gray-100"
                                    >
                                        Calendar
                                    </DisclosureButton>
                                </div>
                            </DisclosurePanel>
                        </div>
                    </div>
                </div>
            </div>
        </Disclosure>
    );
}