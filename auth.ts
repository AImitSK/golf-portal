import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { SanityAdapter } from "./adapters/sanity-adapter"
import { client } from "@/lib/sanity/client"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: SanityAdapter(client),
  session: { strategy: "jwt" },
  ...authConfig,
})
