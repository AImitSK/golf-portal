import { ValidationRule } from '@/types/sanity';

export default {
    name: 'kooperation',
    title: 'Kooperation',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'beschreibung',
            title: 'Beschreibung',
            type: 'text'
        },
        {
            name: 'typ',
            title: 'Typ',
            type: 'string',
            options: {
                list: [
                    'Verbundmitgliedschaft',
                    'Greenfee-Ermäßigung'
                ]
            },
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'website',
            title: 'Website',
            type: 'url'
        },
        {
            name: 'gueltigkeitszeitraum',
            title: 'Gültigkeitszeitraum',
            type: 'string'
        },
        {
            name: 'ansprechpartner',
            title: 'Ansprechpartner',
            type: 'string'
        },
        {
            name: 'kontaktEmail',
            title: 'Kontakt Email',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.email()
        },
        {
            name: 'slug', // Neues Slug-Feld
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name', // Der Slug wird automatisch basierend auf dem Name-Feld generiert
                maxLength: 200, // Maximale Länge des Slugs
            },
            validation: (Rule: ValidationRule) => Rule.required() // Slug ist erforderlich
        }
    ]
};