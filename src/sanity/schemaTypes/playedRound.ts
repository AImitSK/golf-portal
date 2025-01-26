// src/sanity/schemaTypes/playedRound.ts
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'playedRound',
    title: 'Gespielte Runde',
    type: 'document',
    fields: [
        defineField({
            name: 'user',
            title: 'Spieler',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'course',
            title: 'Golfplatz',
            type: 'reference',
            to: [{ type: 'golfCourse' }],
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'playedTee',
            title: 'Gespielter Abschlag',
            type: 'object',
            fields: [
                { name: 'name', type: 'string' },
                { name: 'color', type: 'string' },
                { name: 'courseRating', type: 'number' },
                { name: 'slopeRating', type: 'number' },
                { name: 'par', type: 'number' }
            ]
        }),
        defineField({
            name: 'playerHandicap',
            title: 'Spielvorgabe',
            type: 'number',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'courseHandicap',
            title: 'Course Handicap',
            type: 'number'
        }),
        defineField({
            name: 'date',
            title: 'Datum',
            type: 'date',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'holeScores',
            title: 'Ergebnisse pro Loch',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'number', type: 'number' },
                    { name: 'par', type: 'number' },
                    { name: 'score', type: 'number' },
                    { name: 'netScore', type: 'number' },
                    { name: 'stableford', type: 'number' }
                ]
            }]
        }),
        defineField({
            name: 'totals',
            title: 'Gesamtergebnisse',
            type: 'object',
            fields: [
                { name: 'gross', type: 'number' },
                { name: 'net', type: 'number' },
                { name: 'stableford', type: 'number' }
            ]
        }),
        defineField({
            name: 'weather',
            title: 'Wetter',
            type: 'string',
            options: {
                list: ['Sonnig', 'Bewölkt', 'Regnerisch', 'Windig']
            }
        }),
        defineField({
            name: 'notes',
            title: 'Notizen',
            type: 'text'
        })
    ]
})