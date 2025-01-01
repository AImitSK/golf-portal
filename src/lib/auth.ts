// src/types/next-auth.d.ts
import { DefaultSession } from 'next-auth'
import type { AdminRole, AdminPermission } from '@/types/sanity'

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string
            name?: string | null
            email?: string | null
            role: AdminRole
            permissions?: AdminPermission[]
            image?: string | null
        } & DefaultSession['user']
    }

    interface User {
        id: string
        role: AdminRole
        permissions?: AdminPermission[]
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        role: AdminRole
        permissions?: AdminPermission[]
    }
}