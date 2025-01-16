// src/sanity/schemaTypes/like.ts
import { defineType } from 'sanity';

export default defineType({
    name: 'like',
    title: 'Like',
    type: 'document',
    fields: [
        {
            name: 'club',
            title: 'Golf Club',
            type: 'reference',
            to: [{ type: 'golfclub' }],
            validation: Rule => Rule.required()
        },
        {
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: Rule => Rule.required()
        },
        {
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            validation: Rule => Rule.required()
        }
    ],
});