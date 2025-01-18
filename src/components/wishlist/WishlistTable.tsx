// src/components/wishlist/WishlistTable.tsx
'use client'

import { Menu } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { ClubTag } from '@/components/clubs/ClubTag'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface WishlistItem {
    _id: string
    club: {
        _id: string
        title: string
        slug: string
        adresse: {
            ort: string
        }
        anzahlLoecher: number
        parGesamt: number
        laengeMeter: number
        handicapBeschraenkung: number
        courseRating: number
        slope: number
    }
}

export function WishlistTable({ wishlist }: { wishlist: WishlistItem[] }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const removeFromWishlist = async (entryId: string) => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/wishlist?id=${entryId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ul role="list" className="divide-y divide-gray-100">
            {wishlist.map((item) => (
                <li key={item._id} className="flex items-center justify-between gap-x-6 py-5">
                    <div className="min-w-0">
                        <div className="flex items-start gap-x-3">
                            <p className="text-sm font-semibold text-gray-900">
                                {item.club.title}
                            </p>
                            <ClubTag
                                fieldName="ort"
                                value={item.club.adresse.ort}
                                colorScheme="dark-green"
                                onClick={() => {}}
                            />
                        </div>
                        <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500">
                            <span>{item.club.anzahlLoecher} Loch</span>
                            <span>•</span>
                            <span>Par {item.club.parGesamt}</span>
                            <span>•</span>
                            <span>{item.club.laengeMeter}m</span>
                            <span>•</span>
                            <span>HCP {item.club.handicapBeschraenkung}</span>
                            <span>•</span>
                            <span>CR {item.club.courseRating}</span>
                            <span>•</span>
                            <span>Slope {item.club.slope}</span>
                        </div>
                    </div>
                    <div className="flex flex-none items-center gap-x-4">
                        <button
                            onClick={() => router.push(`/clubs/${item.club.slug}`)}
                            className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                        >
                            Details
                        </button>
                        <Menu as="div" className="relative flex-none">
                            <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                <span className="sr-only">Optionen öffnen</span>
                                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => removeFromWishlist(item._id)}
                                            disabled={isLoading}
                                            className={`
                                                block px-3 py-1 text-sm w-full text-left
                                                ${active ? 'bg-gray-50' : ''}
                                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            Löschen
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => {}}
                                            className={`
                                                block px-3 py-1 text-sm w-full text-left
                                                ${active ? 'bg-gray-50' : ''}
                                            `}
                                        >
                                            Zur Course List
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </div>
                </li>
            ))}
        </ul>
    )
}