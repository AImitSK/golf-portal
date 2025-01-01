import { ValidationRule } from '@/types/sanity'

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
        }
    ]
}