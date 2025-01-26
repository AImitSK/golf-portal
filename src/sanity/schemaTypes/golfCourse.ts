// src/sanity/schemaTypes/golfCourse.ts
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'golfCourse',
    title: 'Golfplatz',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Platzname',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'club',
            title: 'Golfclub',
            type: 'reference',
            to: [{ type: 'golfclub' }],
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'tees',
            title: 'Abschläge',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'name',
                        title: 'Name',
                        type: 'string'
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
                        }
                    },
                    {
                        name: 'gender',
                        title: 'Geschlecht',
                        type: 'string',
                        options: {
                            list: ['Herren', 'Damen']
                        }
                    },
                    {
                        name: 'courseRating',
                        title: 'Course Rating',
                        type: 'number',
                        validation: Rule => Rule.precision(1)
                    },
                    {
                        name: 'slopeRating',
                        title: 'Slope Rating',
                        type: 'number'
                    },
                    {
                        name: 'par',
                        title: 'Par',
                        type: 'number'
                    },
                    {
                        name: 'holes',
                        title: 'Löcher',
                        type: 'array',
                        of: [{
                            type: 'object',
                            fields: [
                                {
                                    name: 'number',
                                    title: 'Loch Nummer',
                                    type: 'number'
                                },
                                {
                                    name: 'par',
                                    title: 'Par',
                                    type: 'number'
                                },
                                {
                                    name: 'length',
                                    title: 'Länge (Meter)',
                                    type: 'number'
                                },
                                {
                                    name: 'handicapIndex',
                                    title: 'Handicap Index',
                                    type: 'number'
                                },
                                {
                                    name: 'courseHCP',
                                    title: 'Course HCP',
                                    type: 'number'
                                }
                            ]
                        }]
                    }
                ]
            }]
        })
    ]
})