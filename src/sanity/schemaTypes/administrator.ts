// src/sanity/schemaTypes/administrator.ts
import { type Rule, type ValidationContext } from '@sanity/types'
import { type AdminPermissions, type UserRole } from '@/types/schemas/auth'

const administratorSchema = {
  name: 'administrator',
  title: 'Administrator',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule: Rule) => rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule: Rule) => rule.required().email()
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
          { title: 'Club Administrator', value: 'club_admin' },
          { title: 'Developer', value: 'developer' },
        ],
      },
      validation: (rule: Rule) => rule.required(),
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
          {title: 'Statistiken einsehen', value: 'view_statistics'},
          {title: 'Club-Profil bearbeiten', value: 'edit_club_profile'},
          {title: 'Mitglieder verwalten', value: 'manage_members'},
          {title: 'Analytics einsehen', value: 'view_analytics'}
        ]
      },
      validation: (rule: Rule) =>
          rule.custom((permissions: AdminPermissions[], context: ValidationContext) => {
            const doc = context.document as { role?: UserRole };
            const role = doc?.role;

            if (role === 'developer') {
              const requiredPermissions: AdminPermissions[] = [
                'manage_users',
                'manage_clubs',
                'manage_contracts',
                'view_statistics'
              ];
              return requiredPermissions.every(p => permissions?.includes(p))
                  ? true
                  : 'Developer benötigen alle Administrator-Berechtigungen';
            }

            if (role === 'club_admin') {
              const allowedPermissions: AdminPermissions[] = [
                'edit_club_profile',
                'manage_members',
                'view_analytics',
                'view_statistics'
              ];
              return permissions?.every(p => allowedPermissions.includes(p))
                  ? true
                  : 'Club Administratoren können nur Club-bezogene Berechtigungen haben';
            }

            return true;
          })
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
      hidden: false,
    },
    {
      name: 'telefon',
      title: 'Telefon',
      type: 'string',
      validation: (rule: Rule) => rule.regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
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
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email'
    }
  }
};

export default administratorSchema;