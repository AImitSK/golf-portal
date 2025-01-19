import { AdapterUser } from "@auth/core/adapters"
import { DefaultSession } from "next-auth"

// Rollen und Typen
export type UserRole = 'user' | 'club_admin' | 'developer';
export type UserType = 'user' | 'administrator';

// Berechtigungen
export type AdminPermissions =
    | 'manage_users'
    | 'manage_clubs'
    | 'manage_contracts'
    | 'view_statistics'
    | 'edit_club_profile'
    | 'manage_members'
    | 'view_analytics';

// Basis Interface für gemeinsame Felder
interface BaseUser {
  name: string;
  email: string;
  image?: string | null;
  emailVerified: Date | null;
  password?: string;
  createdAt?: string;
}

// Sanity-spezifische Felder
interface SanityFields {
  _id: string;
  _type: UserType;
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  aktiv: boolean;
  role: UserRole;
}

// Account Reference
interface SanityAccount {
  _type: string;
  _key: string;
  _ref: string;
}

// Basis User Interface
export interface SanityAdapterUser extends AdapterUser, BaseUser, SanityFields {
  accounts?: Array<SanityAccount>;
  permissions?: AdminPermissions[];
}

// Interface für User-Erstellung
export interface SanityUserCreate extends BaseUser {
  _type: UserType;
  _id: string;
  id: string;
  role: UserRole;
  aktiv: boolean;
}

// Administrator-spezifische Felder
export interface AdministratorExtension {
  telefon?: string;
  position?: string;
  lastLogin?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  permissions?: AdminPermissions[];
}