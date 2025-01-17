// src/types/auth.d.ts
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    aktiv: boolean
    _type: string
    _id: string
  }

  interface Session {
    user: {
      id: string
      role: string
      email: string
      name: string
      aktiv: boolean
      _type: string
      _id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    aktiv?: boolean
    _type?: string
    _id?: string
  }
}