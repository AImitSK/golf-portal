import { ValidationRule } from '@/types/sanity'

export default {
    name: 'land',
    title: 'Land',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'code',
            title: 'Code',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required().length(2)
        }
    ]
}