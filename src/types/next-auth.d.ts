import 'next-auth'
import { Administrator } from './sanity'

declare module 'next-auth' {
    interface User extends Administrator {}

    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            role: string
            permissions?: string[]
            image?: string | null
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        role: string
        permissions?: string[]
    }
}