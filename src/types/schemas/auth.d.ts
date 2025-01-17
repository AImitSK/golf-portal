import { User } from "next-auth"
import { AdapterUser } from "@auth/core/adapters"
import { SanityDocument } from "@sanity/client"
import { Account } from "next-auth"

export interface SanityAdapterUser extends AdapterUser {
  role: string;
  _type: string;
  _id: string;
  aktiv: boolean;
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  accounts?: Array<{
    _type: string;
    _key: string;
    _ref: string;
  }>;
}

export interface SanityUserCreate {
  _type: string;
  _id: string;
  id: string;
  role: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: Date | null;
  aktiv: boolean;
}

export interface SanityUserCreate {
  _type: string;
  _id: string;
  id: string;
  role: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: Date | null;
  aktiv: boolean;
}