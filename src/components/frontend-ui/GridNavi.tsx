'use client';

import { Menu } from '@headlessui/react';
import {
    EllipsisVerticalIcon,
    HeartIcon,
    BookmarkIcon,
    PencilSquareIcon,
} from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface GridNaviProps {
    clubId: string;
}

export default function GridNavi({ clubId }: GridNaviProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const addToWishlist = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clubId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Golfclub zur Wunschliste hinzugefügt');
                router.refresh();
            } else {
                toast.error(data.message || 'Ein Fehler ist aufgetreten');
            }
        } catch {
            toast.error('Ein Fehler ist aufgetreten');
        } finally {
            setIsLoading(false);
        }
    };

    const addToCourseList = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/course-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clubId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Golfclub zur Course List hinzugefügt');
                router.push('/course-list');
            } else {
                toast.error(data.message || 'Ein Fehler ist aufgetreten');
            }
        } catch {
            toast.error('Ein Fehler ist aufgetreten');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Menu as="div" className="relative inline-block text-left z-[1000] mt-0">
            <div>
                <Menu.Button className="flex items-center justify-center h-9 w-9 rounded-full bg-white text-dark-green hover:text-dark-green focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2 focus:ring-offset-white">
                    <span className="sr-only">Menü öffnen</span>
                    <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                </Menu.Button>
            </div>

            <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right divide-y divide-dark-green-10 overflow-visible z-[1050] rounded-md bg-white shadow-lg focus:outline-none">
                <div className="py-1">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={addToWishlist}
                                disabled={isLoading}
                                className={`flex items-center px-4 py-2 text-sm w-full
                                   ${active ? 'bg-dark-green-10 text-dark-green' : 'text-dark-green'}
                                   ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <HeartIcon className="h-5 w-5 text-cta-green mr-2" />
                                zur Wunschliste hinzufügen
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={addToCourseList}
                                disabled={isLoading}
                                className={`flex items-center px-4 py-2 text-sm w-full
                                   ${active ? 'bg-dark-green-10 text-dark-green' : 'text-dark-green'}
                                   ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <BookmarkIcon className="h-5 w-5 text-cta-green mr-2" />
                                zur Course List hinzufügen
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => router.push(`/course-list/new-round?courseId=${clubId}`)}
                                className={`flex items-center px-4 py-2 text-sm w-full
                                   ${active ? 'bg-dark-green-10 text-dark-green' : 'text-dark-green'}`}
                            >
                                <PencilSquareIcon className="h-5 w-5 text-cta-green mr-2" />
                                Ergebniss eintragen
                            </button>
                        )}
                    </Menu.Item>
                </div>
            </Menu.Items>
        </Menu>
    );
}