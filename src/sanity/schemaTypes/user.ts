import { type SchemaTypeDefinition } from 'sanity'
import { ValidationRule } from '@/types/sanity'

const schema: SchemaTypeDefinition = {
    name: 'user',
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
            name: 'emailVerified',
            title: 'Email Verified',
            type: 'datetime',
            readOnly: true
        },
        {
            name: 'aktiv',
            title: 'Aktiv',
            type: 'boolean',
            initialValue: true
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
            name: 'role',
            title: 'Role',
            type: 'string',
            options: {
                list: [
                    { title: 'User', value: 'user' },
                ]
            }
        },
        {
            name: 'createdAt',
            title: 'Erstellt am',
            type: 'datetime',
            readOnly: true
        },
        {
            name: 'password',
            title: 'Passwort',
            type: 'string',
            hidden: false,
        },
        {
            name: 'heimatclub',
            title: 'Heimatclub',
            type: 'reference',
            to: [{ type: 'golfclub' }],
            description: 'Der Golfclub, in dem der User Mitglied ist'
        }
    ]
}

export default schema