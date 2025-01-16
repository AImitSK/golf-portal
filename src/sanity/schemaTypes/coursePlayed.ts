import { type SchemaTypeDefinition } from 'sanity'
import { ValidationRule, WeatherType } from '@/types/sanity'

const schema: SchemaTypeDefinition = {
    name: 'coursePlayed',
    title: 'Gespielte Runde',
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
            name: 'plays',
            title: 'Gespielte Runden',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'date',
                        title: 'Datum',
                        type: 'date',
                        validation: (Rule: ValidationRule) => Rule.required()
                    },
                    {
                        name: 'score',
                        title: 'Score',
                        type: 'number',
                        validation: (Rule: ValidationRule) => Rule.required().min(30).max(200)
                    },
                    {
                        name: 'notiz',
                        title: 'Notiz',
                        type: 'text'
                    },
                    {
                        name: 'wetter',
                        title: 'Wetter',
                        type: 'string',
                        options: {
                            list: ['Sonnig', 'Bewölkt', 'Regnerisch', 'Windig']
                        }
                    }
                ]
            }]
        },
        {
            name: 'createdAt',
            title: 'Erste Runde gespielt am',
            type: 'datetime',
            readOnly: true
        }
    ]
}

export default schema