// src/app/layout.tsx
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Golf Portal",
  description: "Golf Portal",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
          <Navbar />
          <main>
            {children}
          </main>
        </body>
      </html>
    </SessionProvider>
  );
}