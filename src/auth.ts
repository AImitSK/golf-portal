import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { SanityAdapter } from "@/adapters/sanity-adapter"
import sanityClient from "@/lib/sanityClient"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: SanityAdapter(sanityClient),
  session: { strategy: "jwt" },
  ...authConfig,
})
