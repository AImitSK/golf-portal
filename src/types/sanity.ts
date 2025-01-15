// types/sanity.ts
import { Rule } from '@sanity/types'
import { SanityDocument } from '@sanity/client'

export type ValidationRule = Rule

export interface SanityReference {
    _ref: string
    _type: 'reference'
}

export interface SanityImage {
    _type: 'image'
    asset: SanityReference
    crop?: {
        top: number
        bottom: number
        left: number
        right: number
    }
    hotspot?: {
        x: number
        y: number
        height: number
        width: number
    }
}

export interface SEO {
    title?: string
    description?: string
    keywords?: string[]
}

export interface Adresse {
    strasse: string
    hausnummer: string
    plz: number
    ort: string
    land: SanityReference
}

export type ZahlungsStatus = 'aktiv' | 'ausstehend' | 'gekündigt'
export type SupportLevel = 'basic' | 'premium'
export type ZahlungsIntervall = 'monatlich' | 'jährlich'
export type DocumentStatus = 'draft' | 'published'
export type AdminRole = 'admin' | 'manager' | 'staff'
export type AdminPermission = 'manage_users' | 'manage_clubs' | 'manage_contracts' | 'view_statistics'
export type WeatherType = 'Sonnig' | 'Bewölkt' | 'Regnerisch' | 'Windig'

export interface Administrator extends SanityDocument {
    _type: 'administrator'
    name: string
    email: string
    password?: string
    telefon?: string
    position?: string
    role: AdminRole
    aktiv: boolean
    lastLogin?: string
    passwordResetToken?: string
    passwordResetExpiry?: string
    permissions?: AdminPermission[]
}

export interface GolfUser extends SanityDocument {
    _type: 'golfUser'
    name: string
    email: string
    image?: SanityImage
}

export interface Like extends SanityDocument {
    _type: 'like'
    user: SanityReference
    club: SanityReference
    createdAt: string
}

export interface CoursePlayed extends SanityDocument {
    _type: 'coursePlayed'
    user: SanityReference
    club: SanityReference
    date: string
    score: number
    weather?: WeatherType
    notes?: string
}

export interface Wishlist extends SanityDocument {
    _type: 'wishlist'
    user: SanityReference
    club: SanityReference
    notes?: string
}