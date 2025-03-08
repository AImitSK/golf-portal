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
            },
            initialValue: 'user'
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
            name: 'aktiv',
            title: 'Aktiv',
            type: 'boolean',
            initialValue: true
        },
        {
            name: 'isTwoFactorEnabled',
            title: 'Zwei-Faktor-Authentifizierung aktiviert',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'handicapIndex',
            title: 'Handicap Index',
            type: 'number'
        },
        {
            name: 'handicapHistory',
            title: 'Handicap Verlauf',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'handicapEntry',
                    fields: [
                        {
                            name: 'date',
                            title: 'Datum',
                            type: 'date',
                            validation: (Rule: ValidationRule) => Rule.required()
                        },
                        {
                            name: 'handicapIndex',
                            title: 'Handicap Index',
                            type: 'number',
                            validation: (Rule: ValidationRule) => Rule.required()
                        },
                        {
                            name: 'reason',
                            title: 'Grund',
                            type: 'string'
                        }
                    ]
                }
            ]
        },
        {
            name: 'heimatclub',
            title: 'Heimatclub',
            type: 'reference',
            to: [{ type: 'golfclub' }]
        }
    ]
}

export default schema