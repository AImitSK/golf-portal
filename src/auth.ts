// src/auth.ts

import NextAuth from "next-auth";
import type { DefaultSession, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import { SanityAdapter } from "@/adapters/sanity-adapter";
import sanityClient from "@/lib/sanityClient";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/schemas/auth-schemas";
import bcrypt from "bcryptjs";
import { getUserById } from "@/data/user";
import type { Adapter } from "next-auth/adapters";

// Definiere die Basis-Typen hier, bis das Modul-Problem gelöst ist
type UserRole = 'user' | 'admin';
type UserType = 'user' | 'administrator';

// Interface für den Sanity User
interface SanityAdapterUser extends User {
    _id: string;
    _type: UserType;
    role: UserRole;
    aktiv: boolean;
    password?: string;
    emailVerified: Date | null;
}

interface LoginCredentials {
    email?: string;
    password?: string;
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: UserRole;
            _type: UserType;
            _id: string;
            aktiv: boolean;
        } & DefaultSession["user"]
    }

    interface User {
        role: UserRole;
        _type: UserType;
        _id: string;
        aktiv: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: UserRole;
        _type: UserType;
        _id: string;
        aktiv: boolean;
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    unstable_update
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
        Credentials({
            async authorize(credentials): Promise<SanityAdapterUser | null> {
                try {
                    const validatedFields = LoginSchema.safeParse(credentials);
                    if (!validatedFields.success) return null;

                    const loginCredentials = credentials as unknown as LoginCredentials;

                    if (!loginCredentials.email || !loginCredentials.password) return null;

                    const user_qry = `*[(_type == "user" || _type == "administrator") && email == $email][0]`;
                    const user = await sanityClient.fetch<SanityAdapterUser>(user_qry, { email: loginCredentials.email });

                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        loginCredentials.password,
                        user.password
                    );

                    if (passwordsMatch) return user;

                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    session: { strategy: "jwt" },
    adapter: SanityAdapter(sanityClient) as Adapter,
    callbacks: {
        async session({ session, token }): Promise<Session> {
            if (!session?.user) return session;

            try {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        // Stelle sicher, dass id immer einen String-Wert hat
                        id: token.sub ?? "",
                        role: token.role ?? "user",
                        _type: token._type ?? "user",
                        _id: token._id ?? token.sub ?? "",
                        aktiv: token.aktiv ?? true,
                        // Verwende Nullish Coalescing für optionale Werte
                        name: token.name ?? session.user.name ?? "",
                        email: token.email ?? session.user.email ?? "",
                        image: token.picture ?? null
                    }
                };
            } catch (error) {
                console.error("Session callback error:", error);
                // Stelle einen validen Default-User bereit
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: "",
                        role: "user",
                        _type: "user",
                        _id: "",
                        aktiv: true,
                        name: session.user.name ?? "",
                        email: session.user.email ?? "",
                        image: null
                    }
                };
            }
        },

        async jwt({ token, user }): Promise<JWT> {
            try {
                if (user) {
                    return {
                        ...token,
                        role: user.role ?? "user",
                        _type: user._type ?? "user",
                        _id: user._id ?? token.sub ?? "",
                        aktiv: user.aktiv ?? true
                    };
                }

                if (!token?.sub) {
                    return {
                        ...token,
                        sub: "", // Expliziter leerer String statt undefined
                        role: "user",
                        _type: "user",
                        _id: "",
                        aktiv: true
                    };
                }

                const existingUser = await getUserById(token.sub);

                if (!existingUser) {
                    return {
                        ...token,
                        role: "user",
                        _type: "user",
                        _id: token.sub,
                        aktiv: true
                    };
                }

                return {
                    ...token,
                    name: existingUser.name ?? token.name ?? "",
                    email: existingUser.email ?? token.email ?? "",
                    role: existingUser.role ?? "user",
                    _type: existingUser._type ?? "user",
                    _id: existingUser._id ?? token.sub ?? "",
                    aktiv: existingUser.aktiv ?? true,
                    picture: existingUser.image ?? token.picture ?? null
                };
            } catch (error) {
                console.error("JWT callback error:", error);
                return {
                    ...token,
                    role: "user",
                    _type: "user",
                    _id: token.sub ?? "",
                    aktiv: true
                };
            }
        }
    }
});