"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center px-2 text-gray-900 font-semibold"
            >
              Golf Portal
            </Link>
          </div>
          <div className="flex items-center">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user.name || session.user.email}
                </span>
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Anmelden
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
