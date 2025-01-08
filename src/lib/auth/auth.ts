import NextAuth from "next-auth"
import { SanityAdapter } from "./adapter"
import { authConfig } from "./auth.config"
import { client } from "@/lib/sanity/client"

export const {
 handlers: { GET, POST },
 auth,
 signIn,
 signOut
} = NextAuth({
 adapter: SanityAdapter(client),
 session: { strategy: "jwt" },
 ...authConfig
})