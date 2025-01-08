import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { client } from "@/lib/sanity/client"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      async authorize(credentials: any) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await client.fetch(
            `*[_type == "administrator" && email == $email][0]`,
            { email: credentials.email }
          );

          if (!user || !user.password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
    async jwt({ token }) {
      return token;
    }
  }
}
