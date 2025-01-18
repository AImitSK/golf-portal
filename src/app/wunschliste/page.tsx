// src/app/wunschliste/page.tsx
import React from 'react';
import { auth } from "@/auth";
import { getWishlistByUserId } from "@/lib/sanity/getWishlist";
import { WishlistTable } from "@/components/wishlist/WishlistTable";
import { redirect } from "next/navigation";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Meine Wunschliste',
    description: 'Verwalte deine favorisierten Golfclubs'
};

export default async function WishlistPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/auth/login');
    }

    const wishlist = await getWishlistByUserId(session.user._id);

    return (
        <>
            {/* Navigation */}
            <NavigationFrontend />

            {/* Content */}
            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="max-w-[1200px] mx-auto">
                    <h1 className="text-2xl font-bold text-dark-green mb-8">
                        Meine Wunschliste
                    </h1>

                    {wishlist.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                Deine Wunschliste ist noch leer.
                                Füge Golfclubs hinzu, die dich interessieren.
                            </p>
                        </div>
                    ) : (
                        <WishlistTable wishlist={wishlist} />
                    )}
                </div>
            </div>

            {/* Footer */}
            <FooterFrontend />
        </>
    );
}