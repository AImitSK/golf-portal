import { type SchemaTypeDefinition } from 'sanity'
import { ValidationRule } from '@/types/sanity'

const schema: SchemaTypeDefinition = {
    name: 'like',
    title: 'Like',
    type: 'document',
    fields: [
        {
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'golfUser' }],
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'club',
            title: 'Golfclub',
            type: 'reference',
            to: [{ type: 'golfclub' }],
            validation: (Rule: ValidationRule) => Rule.required()
        },
        {
            name: 'createdAt',
            title: 'Erstellt am',
            type: 'datetime',
            readOnly: true
        }
    ]
}

export default schema