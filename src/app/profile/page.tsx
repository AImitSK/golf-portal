// src/app/profile/page.tsx
import { Metadata } from "next";
import NavigationFrontend from "@/components/frontend-ui/NavigationFrontend";
import FooterFrontend from "@/components/frontend-ui/FooterFrontend";
import { Heading } from "@/components/frontend-ui/Heading";
import ProfileForm from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
    title: 'Mein Profil',
    description: 'Verwalte dein Golfprofil und persönliche Einstellungen'
};

export default function ProfilePage() {
    return (
        <>
            <NavigationFrontend />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Heading level={1} className="mb-8">
                        Mein Profil
                    </Heading>

                    <ProfileForm />
                </div>
            </main>

            <FooterFrontend />
        </>
    );
}

