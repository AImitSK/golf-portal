import 'next-auth'
import { UserRole, UserType, AdminPermissions } from '@/types/schemas/auth'

declare module 'next-auth' {
    interface User {
        id: string;
        role: UserRole;
        _type: UserType;
        _id: string;
        aktiv: boolean;
        permissions?: AdminPermissions[];
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            role: UserRole;
            _type: UserType;
            _id: string;
            aktiv: boolean;
            permissions?: AdminPermissions[];
            image?: string | null;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: UserRole;
        _type: UserType;
        _id: string;
        aktiv: boolean;
        permissions?: AdminPermissions[];
    }
}