import { type SchemaTypeDefinition } from 'sanity'
import { ValidationRule } from '@/types/sanity'

const schema: SchemaTypeDefinition = {
    name: 'golfUser',
    title: 'Golf User',
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
            name: 'image',
            title: 'Profilbild',
            type: 'image',
            options: {
                hotspot: true
            }
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