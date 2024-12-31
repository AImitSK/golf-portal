import { ValidationRule, ZahlungsStatus, DocumentStatus } from '@/types/sanity'

export default {
    name: 'golfclub',
    title: 'Golfclub',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96
            },
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: ['draft', 'published']
            },
            validation: (Rule: ValidationRule) =>
                Rule.required().custom((status: DocumentStatus) => {
                    if (!['draft', 'published'].includes(status)) {
                        return 'Invalid status'
                    }
                    return true
                })
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
                {
                    name: 'title',
                    type: 'string',
                    title: 'Title'
                },
                {
                    name: 'description',
                    type: 'text',
                    title: 'Description'
                },
                {
                    name: 'keywords',
                    type: 'array',
                    title: 'Keywords',
                    of: [{type: 'string'}]
                }
            ]
        },
        {
            name: 'adresse',
            title: 'Adresse',
            type: 'object',
            fields: [
                {
                    name: 'strasse',
                    type: 'string',
                    title: 'Straße',
                    validation: (Rule: ValidationRule) => Rule.required()
                },
                {
                    name: 'hausnummer',
                    type: 'string',
                    title: 'Hausnummer',
                    validation: (Rule: ValidationRule) => Rule.required()
                },
                {
                    name: 'plz',
                    type: 'number',
                    title: 'PLZ',
                    validation: (Rule: ValidationRule) => Rule.min(10000).max(99999).required()
                },
                {
                    name: 'ort',
                    type: 'string',
                    title: 'Ort',
                    validation: (Rule: ValidationRule) => Rule.required()
                },
                {
                    name: 'land',
                    type: 'reference',
                    to: [{type: 'land'}]
                }
            ]
        },
        {
            name: 'hauptAdmin',
            title: 'Hauptadministrator',
            type: 'reference',
            to: [{type: 'administrator'}],
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'weitereAdmins',
            title: 'Weitere Administratoren',
            type: 'array',
            of: [{type: 'reference', to: [{type: 'administrator'}]}]
        },
        {
            name: 'aktuellesModell',
            title: 'Aktuelles Vertragsmodell',
            type: 'reference',
            to: [{type: 'vertragsmodell'}],
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'vertragsBeginn',
            title: 'Vertragsbeginn',
            type: 'date'
        },
        {
            name: 'vertragsEnde',
            title: 'Vertragsende',
            type: 'date'
        },
        {
            name: 'zahlungsStatus',
            title: 'Zahlungsstatus',
            type: 'string',
            options: {
                list: ['aktiv', 'ausstehend', 'gekündigt']
            },
            validation: (Rule: ValidationRule) =>
                Rule.required().custom((status: ZahlungsStatus) => {
                    if (!['aktiv', 'ausstehend', 'gekündigt'].includes(status)) {
                        return 'Invalid status'
                    }
                    return true
                })
        }
    ]
}