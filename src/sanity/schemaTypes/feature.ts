import { ValidationRule } from '@/types/sanity'

export default {
    name: 'feature',
    title: 'Feature',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'beschreibung',
            title: 'Beschreibung',
            type: 'text'
        }
    ]
}