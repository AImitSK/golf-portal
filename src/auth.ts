import NextAuth from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { SanityAdapter } from "@/adapters/sanity-adapter"
import sanityClient from "@/lib/sanityClient"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/types/schemas/auth-schemas"
import bcrypt from "bcryptjs"
import { getUserById } from "@/data/user"
import type { Adapter } from "next-auth/adapters"

type UserType = "user" | "administrator";
type UserRole = "user" | "admin";

interface SanityUser {
    id: string;
    _id: string;
    _rev: string;
    _createdAt: string;
    _updatedAt: string;
    role: UserRole;
    _type: UserType;
    aktiv: boolean;
    email: string;
    name: string;
    password?: string;
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
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
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
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
        }),
        Credentials({
            async authorize(credentials): Promise<SanityUser | null> {
                try {
                    const validatedFields = LoginSchema.safeParse(credentials);
                    if (!validatedFields.success) return null;

                    const loginCredentials = credentials as unknown as LoginCredentials;

                    if (!loginCredentials.email || !loginCredentials.password) return null;

                    const user_qry = `*[(_type == "user" || _type == "administrator") && email == $email][0]`;
                    const user = await sanityClient.fetch<SanityUser>(user_qry, { email: loginCredentials.email });

                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        loginCredentials.password,
                        user.password
                    );

                    if (passwordsMatch) {
                        return {
                            id: user._id,
                            _id: user._id,
                            _rev: user._rev,
                            _createdAt: user._createdAt,
                            _updatedAt: user._updatedAt,
                            role: user.role,
                            _type: user._type,
                            aktiv: user.aktiv,
                            email: user.email,
                            name: user.name
                        };
                    }

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
        async session({ session, token }) {
            if (!session.user) return session;

            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub ?? session.user.id,
                    role: token.role as UserRole,
                    _type: token._type as UserType,
                    _id: token._id as string,
                    aktiv: token.aktiv as boolean,
                    name: token.name as string,
                    email: token.email as string,
                    image: token.picture ?? null  // Hier wird das Bild übertragen
                }
            };
        },
        async jwt({ token }) {
            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            return {
                ...token,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role as UserRole,
                _type: existingUser._type as UserType,
                _id: existingUser._id,
                aktiv: existingUser.aktiv,
                picture: existingUser.image  // Hier speichern wir die Bild-URL
            };
        }
    }
})