import { User } from "next-auth"
import { AdapterUser } from "@auth/core/adapters"

export interface SanityAdapterUser extends AdapterUser {
    role: string;
    _type: string;
    _id: string;
    aktiv: boolean;
}

declare module "@auth/core/adapters" {
    interface AdapterUser extends User {
        role: string;
        _type: string;
        _id: string;
        aktiv: boolean;
    }
}