import { ValidationRule } from '@/types/sanity'

export default {
    name: 'administrator',
    title: 'Administrator',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required().email()
        },
        {
            name: 'telefon',
            title: 'Telefon',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        },
        {
            name: 'position',
            title: 'Position',
            type: 'string'
        },
        {
            name: 'aktiv',
            title: 'Aktiv',
            type: 'boolean',
            initialValue: true
        }
    ]
}