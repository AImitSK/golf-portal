import { type SchemaTypeDefinition } from 'sanity'
import { ValidationRule } from '@/types/sanity'

const schema: SchemaTypeDefinition = {
    name: 'wishlist',
    title: 'Wunschliste',
    type: 'document',
    fields: [
        {
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }],
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
            name: 'notiz',
            title: 'Notiz',
            type: 'text'
        },
        {
            name: 'createdAt',
            title: 'Hinzugefügt am',
            type: 'datetime',
            readOnly: true
        }
    ]
}

export default schema