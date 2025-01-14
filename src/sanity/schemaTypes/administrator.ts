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
      name: 'emailVerified',
      title: 'Email Verified',
      type: 'datetime',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string'
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      initialValue: 'user',
      options: {
        list: [
          { title: 'User', value: 'user' },
          { title: 'Admin', value: 'admin' },
        ],
      },
    },
    {
      name: 'aktiv',
      title: 'Aktiv',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'password',
      title: 'Passwort',
      type: 'string',
      hidden: false, // Versteckt im Sanity Studio
      // Kein required hier, da wir das später programmatisch setzen
    },
/*     {
      name: 'accounts',
      title: 'Verbundene Konten',
      type: 'array',
      hidden: true,
      of: [{
        type: 'reference',
        to: [{ type: 'account' }]
      }]
    }, */
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
      name: 'lastLogin',
      title: 'Letzter Login',
      type: 'datetime',
      readOnly: true,
      hidden: true
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
      initialValue: []
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email'
    }
  }
}