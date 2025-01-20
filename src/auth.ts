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
        } & DefaultSession["user"];
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
                    if (!validatedFields.success) {
                        console.error("Validation fehlgeschlagen:", validatedFields.error);
                        return null;
                    }

                    const loginCredentials = credentials as unknown as LoginCredentials;

                    if (!loginCredentials.email || !loginCredentials.password) {
                        console.error("Ungültige Login-Daten (fehlende E-Mail oder Passwort).");
                        return null;
                    }

                    console.log("Sanity Login mit E-Mail:", loginCredentials.email);

                    // Abruf vom Benutzer aus Sanity
                    const user_qry = `*[(_type == "user" || _type == "administrator") && email == $email][0]`;
                    const user = await sanityClient.fetch<SanityAdapterUser>(user_qry, { email: loginCredentials.email });

                    if (!user) {
                        console.error("Benutzer nicht gefunden:", loginCredentials.email);
                        return null;
                    }

                    // Überprüfe Passwort
                    const passwordsMatch = await bcrypt.compare(
                        loginCredentials.password,
                        user.password ?? ""
                    );

                    if (!passwordsMatch) {
                        console.error("Passwort stimmt nicht überein für:", loginCredentials.email);
                        return null;
                    }

                    // Validierung der Benutzer-ID
                    if (!user._id.startsWith("user.")) {
                        console.error("Ungültige Benutzer-ID:", user._id);
                        return null;
                    }

                    console.log("Benutzer erfolgreich eingeloggt:", user._id);
                    return user;

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
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            if (!session?.user) return session;

            const formattedId =
                token._id?.startsWith("user.") || token._id?.startsWith("administrator.")
                    ? token._id
                    : `user.${token._id ?? token.sub ?? ""}`;

            session.user = {
                ...session.user,
                id: token.sub ?? "",
                role: token.role ?? "user",
                _type: token._type ?? "user",
                _id: formattedId,
                aktiv: token.aktiv ?? true,
                name: token.name ?? session.user.name ?? "",
                email: token.email ?? session.user.email ?? "",
                image: token.picture ?? null,
            };

            console.log("Session erfolgreich erstellt:", session.user);
            return session;
        },

        async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
            if (user) {
                return {
                    ...token,
                    role: user.role ?? "user",
                    _type: user._type ?? "user",
                    _id: user._id.startsWith("user.") ? user._id : `user.${user._id}`, // Hier sicherstellen
                    aktiv: user.aktiv ?? true,
                };
            }

            const prefixedId = token._id.startsWith("user.") || token._id.startsWith("administrator.")
                ? token._id
                : `user.${token._id}`;

            const existingUser = await getUserById(prefixedId); // Ändern Sie hier auf die formatierte ID

            if (!existingUser) {
                console.error("Benutzer-ID existiert nicht:", prefixedId); // Gibt "präfixierte" ID aus
                return {
                    ...token,
                    role: "user",
                    _type: "user",
                    _id: prefixedId,
                    aktiv: true,
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
                picture: existingUser.image ?? token.picture ?? null,
            };
        }
    },

});