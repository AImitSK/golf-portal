import type { NextAuthConfig } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"
import type { User, UserRole } from "@/types/auth"
import Credentials from "next-auth/providers/credentials"
import { client } from '@/lib/sanity/client'
import { comparePasswords } from "@/lib/auth/utils"

export const authConfig: NextAuthConfig = {
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
       token.role = user.role as UserRole;
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
         role: token.role as UserRole,
         permissions: token.permissions as string[],
         aktiv: token.aktiv as boolean
       }
     };
   }
 },
 pages: {
   signIn: '/login',
   error: '/error'
 }
}