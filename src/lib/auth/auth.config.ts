import type { DefaultSession } from "next-auth"
import type { User, UserRole } from "@/types/auth"
import Credentials from "next-auth/providers/credentials"
import { client } from '@/lib/sanity/client'
import { comparePasswords } from "@/lib/auth/utils"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      permissions?: string[];
      aktiv: boolean;
    }
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
    permissions?: string[];
    aktiv: boolean;
  }
}

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await client.fetch(
          `*[_type == "administrator" && email == $email && aktiv == true][0]`,
          { email }
        );

        if (!user) return null;
        const passwordsMatch = await comparePasswords(password, user.password);
        if (!passwordsMatch) return null;

        // Konvertiere die String-Rolle in den UserRole-Enum
        user.role = user.role as UserRole;
        
        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.permissions = user.permissions || [];
        token.aktiv = user.aktiv;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          permissions: token.permissions,
          aktiv: token.aktiv
        }
      };
    }
  },
  pages: {
    signIn: '/login',
    error: '/error'
  }
} as const