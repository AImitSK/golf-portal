import { ValidationRule } from '@/types/sanity'

export default {
    name: 'administrator',
    title: 'Administrator',
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
            name: 'password',
            title: 'Passwort',
            type: 'string',
            hidden: true, // Versteckt im Sanity Studio
            // Kein required hier, da wir das später programmatisch setzen
        },
        {
            name: 'telefon',
            title: 'Telefon',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        },
        {
            name: 'position',
            title: 'Position',
            type: 'string'
        },
        {
            name: 'role',
            title: 'Rolle',
            type: 'string',
            initialValue: 'admin',
            options: {
                list: [
                    {title: 'Administrator', value: 'admin'},
                    {title: 'Manager', value: 'manager'},
                    {title: 'Mitarbeiter', value: 'staff'}
                ]
            }
        },
        {
            name: 'aktiv',
            title: 'Aktiv',
            type: 'boolean',
            initialValue: true
        },
        {
            name: 'lastLogin',
            title: 'Letzter Login',
            type: 'datetime',
            readOnly: true,
            // Entfernt required validation
            hidden: true // Verstecken im Studio
        },
        {
            name: 'passwordResetToken',
            title: 'Password Reset Token',
            type: 'string',
            hidden: true
        },
        {
            name: 'passwordResetExpiry',
            title: 'Password Reset Ablaufdatum',
            type: 'datetime',
            hidden: true
        },
        {
            name: 'permissions',
            title: 'Berechtigungen',
            type: 'array',
            of: [{type: 'string'}],
            options: {
                list: [
                    {title: 'Benutzer verwalten', value: 'manage_users'},
                    {title: 'Clubs verwalten', value: 'manage_clubs'},
                    {title: 'Verträge verwalten', value: 'manage_contracts'},
                    {title: 'Statistiken einsehen', value: 'view_statistics'}
                ]
            },
            initialValue: [] // Leeres Array als Initialwert
        }
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'email'
        }
    }
}