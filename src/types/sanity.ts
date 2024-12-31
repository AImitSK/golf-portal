import { Rule } from '@sanity/types'

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