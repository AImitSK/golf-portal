import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import sanityClient from "@/lib/sanityClient"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await sanityClient.fetch(
          `*[_type == "administrator" && email == $email][0]`,
          { email: credentials.email }
        );

        if (!user || !user?.password) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        )

        if (!passwordsMatch) {
          return null
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          _type: "administrator",
          role: user.role || "user",
          aktiv: user.aktiv || true,
          _id: user._id,
          _rev: user._rev,
          _createdAt: user._createdAt,
          _updatedAt: user._updatedAt,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
    async jwt({ token }) {
      return token;
    }
  },
}
