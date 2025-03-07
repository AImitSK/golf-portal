// src/sanity/schemaTypes/golfRound.ts
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'golfRound',
    title: 'Golf Runde',
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
            name: 'date',
            title: 'Datum',
            type: 'date',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'playedTee',
            title: 'Gespielter Abschlag',
            type: 'object',
            fields: [
                {
                    name: 'name',
                    title: 'Name',
                    type: 'string',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'color',
                    title: 'Farbe',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Weiß', value: 'white' },
                            { title: 'Gelb', value: 'yellow' },
                            { title: 'Blau', value: 'blue' },
                            { title: 'Rot', value: 'red' }
                        ]
                    },
                    validation: Rule => Rule.required()
                },
                {
                    name: 'gender',
                    title: 'Geschlecht',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Herren', value: 'Herren' },
                            { title: 'Damen', value: 'Damen' }
                        ]
                    },
                    validation: Rule => Rule.required()
                },
                {
                    name: 'courseRating',
                    title: 'Course Rating',
                    type: 'number',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'slopeRating',
                    title: 'Slope Rating',
                    type: 'number',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'par',
                    title: 'Par',
                    type: 'number',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'holes',
                    title: 'Löcher',
                    type: 'array',
                    options: { sortable: false },
                    of: [{
                        type: 'object',
                        name: 'hole',
                        title: 'Loch',
                        fields: [
                            {
                                name: 'number',
                                title: 'Loch Nummer',
                                type: 'number',
                                validation: Rule => Rule.required().min(1)
                            },
                            {
                                name: 'par',
                                title: 'Par',
                                type: 'number',
                                validation: Rule => Rule.required().min(3).max(6)
                            },
                            {
                                name: 'handicapIndex',
                                title: 'Handicap Index',
                                type: 'number',
                                validation: Rule => Rule.required()
                            },
                            {
                                name: 'length',
                                title: 'Länge (Meter)',
                                type: 'number'
                            },
                            {
                                name: 'courseHCP',
                                title: 'Course HCP',
                                type: 'number'
                            }
                        ]
                    }],
                    validation: Rule => Rule.required()
                }
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
            type: 'number',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'holeScores',
            title: 'Ergebnisse pro Loch',
            type: 'array',
            options: { sortable: false },
            of: [{
                type: 'object',
                name: 'holeScore',
                title: 'Loch Score',
                fields: [
                    {
                        name: 'number',
                        title: 'Loch Nummer',
                        type: 'number',
                        validation: Rule => Rule.required().min(1)
                    },
                    {
                        name: 'par',
                        title: 'Par',
                        type: 'number',
                        validation: Rule => Rule.required().min(3).max(6)
                    },
                    {
                        name: 'score',
                        title: 'Score',
                        type: 'number',
                        validation: Rule => Rule.required().min(1)
                    },
                    {
                        name: 'netScore',
                        title: 'Netto Score',
                        type: 'number',
                        validation: Rule => Rule.required()
                    },
                    {
                        name: 'stableford',
                        title: 'Stableford',
                        type: 'number',
                        validation: Rule => Rule.required().min(0)
                    },
                    {
                        name: 'extraStroke',
                        title: 'Extra Schlag',
                        type: 'boolean',
                        description: 'Zeigt an, ob auf diesem Loch ein Extra-Schlag aufgrund des Handicaps gewährt wurde'
                    }
                ]
            }],
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'totals',
            title: 'Gesamtergebnisse',
            type: 'object',
            fields: [
                {
                    name: 'gross',
                    title: 'Brutto',
                    type: 'number',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'net',
                    title: 'Netto',
                    type: 'number',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'stableford',
                    title: 'Stableford',
                    type: 'number',
                    validation: Rule => Rule.required()
                }
            ]
        }),
        defineField({
            name: 'weather',
            title: 'Wetter',
            type: 'string',
            options: {
                list: [
                    { title: 'Sonnig', value: 'sunny' },
                    { title: 'Bewölkt', value: 'cloudy' },
                    { title: 'Regnerisch', value: 'rainy' },
                    { title: 'Windig', value: 'windy' }
                ]
            }
        }),
        defineField({
            name: 'notes',
            title: 'Notizen',
            type: 'text'
        })
    ]
})