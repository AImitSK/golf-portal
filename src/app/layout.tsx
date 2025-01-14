// src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import { ScrollToTop } from '@/components/common/ScrollToTop';
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: '%s | Deutsche Golfclubs',
        default: 'Deutsche Golfclubs - Finde deinen Golfclub',
    },
    description: 'Entdecke die schönsten Golfclubs in Deutschland',
};

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Hauptinhalt der Seite */}
        {children}
        <ScrollToTop />
        </body>
        </html>
    );
}