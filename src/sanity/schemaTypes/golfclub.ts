// src/sanity/schemaTypes/golfclub.ts
export default {
    name: 'golfclub',
    title: 'Golfclub',
    type: 'document',
    groups: [
        { name: 'basis', title: 'Basis-Informationen' },
        { name: 'bilder', title: 'Bilder' },
        { name: 'administration', title: 'Administration' },
        { name: 'platz', title: 'Platz-Details' },
        { name: 'einrichtungen', title: 'Einrichtungen' },
        { name: 'club', title: 'Club-Informationen' }
    ],
    fields: [
        // Basis-Informationen
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required(),
            group: 'basis'
        },
        {
            name: 'beschreibung',
            title: 'Beschreibung',
            type: 'text',
            description: 'Allgemeine Beschreibung des Golfclubs',
            group: 'basis'
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96
            },
            validation: (Rule: ValidationRule) => Rule.required(),
            group: 'basis'
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: ['draft', 'published']
            },
            validation: (Rule: ValidationRule) =>
                Rule.required().custom((status: DocumentStatus) => {
                    if (!['draft', 'published'].includes(status)) {
                        return 'Invalid status'
                    }
                    return true
                }),
            group: 'basis'
        },
        // Basis-Kontakt
        {
            name: 'clubWebsite',
            title: 'Club Website',
            type: 'url',
            group: 'basis'
        },
        {
            name: 'clubEmail',
            title: 'Club E-Mail',
            type: 'string',
            group: 'basis'
        },
        {
            name: 'clubTelefon',
            title: 'Club Telefon',
            type: 'string',
            group: 'basis'
        },
        // SEO
        {
            name: 'seo',
            title: 'SEO',
            type: 'object',
            group: 'basis',
            fields: [
                {
                    name: 'title',
                    type: 'string',
                    title: 'Title'
                },
                {
                    name: 'description',
                    type: 'text',
                    title: 'Description'
                },
                {
                    name: 'keywords',
                    type: 'array',
                    title: 'Keywords',
                    of: [{ type: 'string' }]
                }
            ]
        },
        // Bilder
        {
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true
            },
            group: 'bilder'
        },
        {
            name: 'titelbild',
            title: 'Titelbild',
            type: 'image',
            options: {
                hotspot: true
            },
            group: 'bilder'
        },
        {
            name: 'bildergalerie',
            title: 'Bildergalerie',
            type: 'array',
            of: [{
                type: 'image',
                options: {
                    hotspot: true
                },
                fields: [
                    {
                        name: 'beschreibung',
                        type: 'string',
                        title: 'Beschreibung'
                    },
                    {
                        name: 'alt',
                        type: 'string',
                        title: 'Alt Text'
                    }
                ]
            }],
            group: 'bilder'
        },
        // Adresse
        {
            name: 'adresse',
            title: 'Adresse',
            type: 'object',
            group: 'basis',
            fields: [
                {
                    name: 'strasse',
                    type: 'string',
                    title: 'Straße',
                    validation: (Rule: ValidationRule) => Rule.required()
                },
                {
                    name: 'hausnummer',
                    type: 'string',
                    title: 'Hausnummer',
                },
                {
                    name: 'plz',
                    type: 'number',
                    title: 'PLZ',
                    validation: (Rule: ValidationRule) => Rule.min(10000).max(99999).required()
                },
                {
                    name: 'ort',
                    type: 'string',
                    title: 'Ort',
                    validation: (Rule: ValidationRule) => Rule.required()
                },
                {
                    name: 'land',
                    type: 'reference',
                    to: [{ type: 'land' }]
                },
                {
                    name: 'location',
                    title: 'Koordinaten',
                    type: 'geopoint',
                    description: 'Koordinaten werden automatisch aus der Adresse ermittelt',
                    validation: (Rule: ValidationRule) => Rule.required()
                }
            ]
        },
        // Administration
        {
            name: 'hauptAdmin',
            title: 'Hauptadministrator',
            type: 'reference',
            to: [{ type: 'administrator' }],
            group: 'administration'
        },
        {
            name: 'weitereAdmins',
            title: 'Weitere Administratoren',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'administrator' }] }],
            group: 'administration'
        },
        {
            name: 'aktuellesModell',
            title: 'Aktuelles Vertragsmodell',
            type: 'reference',
            to: [{ type: 'vertragsmodell' }],
            group: 'administration'
        },
        {
            name: 'stripeCustomerId',
            title: 'Stripe Customer ID',
            type: 'string',
            group: 'administration'
        },
        {
            name: 'subscriptionStatus',
            title: 'Subscription Status',
            type: 'string',
            options: {
                list: ['active', 'trialing', 'past_due', 'canceled', 'incomplete']
            },
            group: 'administration'
        },
        {
            name: 'vertragsBeginn',
            title: 'Vertragsbeginn',
            type: 'date',
            group: 'administration'
        },
        {
            name: 'vertragsEnde',
            title: 'Vertragsende',
            type: 'date',
            group: 'administration'
        },
        {
            name: 'zahlungsStatus',
            title: 'Zahlungsstatus',
            type: 'string',
            options: {
                list: ['aktiv', 'ausstehend', 'gekündigt']
            },
            validation: (Rule: ValidationRule) =>
                Rule.required().custom((status: ZahlungsStatus) => {
                    if (!['aktiv', 'ausstehend', 'gekündigt'].includes(status)) {
                        return 'Invalid status'
                    }
                    return true
                }),
            group: 'administration'
        },
        {
            name: 'claimToken',
            title: 'Claim Token',
            type: 'string',
            group: 'administration'
        },
        {
            name: 'isClaimed',
            title: 'Ist beansprucht',
            type: 'boolean',
            initialValue: false,
            group: 'administration'
        },
        // Platz-Details
        {
            name: 'anzahlLoecher',
            title: 'Anzahl Löcher',
            type: 'number',
            options: {
                list: [9, 18, 27, 36]
            },
            validation: (Rule: ValidationRule) => Rule.required(),
            group: 'platz'
        },
        {
            name: 'parGesamt',
            title: 'Par Gesamt',
            type: 'number',
            group: 'platz'
        },
        {
            name: 'laengeMeter',
            title: 'Länge in Metern',
            type: 'number',
            group: 'platz'
        },
        {
            name: 'handicapBeschraenkung',
            title: 'Handicap-Beschränkung',
            type: 'number',
            group: 'platz'
        },
        {
            name: 'courseRating',
            title: 'Course Rating',
            type: 'number',
            validation: (Rule: ValidationRule) => Rule.precision(1),
            group: 'platz'
        },
        {
            name: 'slope',
            title: 'Slope',
            type: 'number',
            group: 'platz'
        },
        {
            name: 'schwierigkeitsgrad',
            title: 'Schwierigkeitsgrad',
            type: 'string',
            options: {
                list: ['Anfänger', 'Fortgeschrittene', 'Championship']
            },
            group: 'platz'
        },
        {
            name: 'platztyp',
            title: 'Platztyp',
            type: 'string',
            options: {
                list: ['Links Course', 'Parkland', 'Heath Course', 'Desert Course', 'Mountain Course']
            },
            group: 'platz'
        },
        {
            name: 'besonderheiten',
            title: 'Besonderheiten',
            type: 'array',
            of: [{
                type: 'string',
                options: {
                    list: [
                        'Wasserhindernisse',
                        'Bunker',
                        'Doglegs',
                        'Höhenunterschiede',
                        'Waldbereiche',
                        'Out of Bounds'
                    ]
                }
            }],
            group: 'platz'
        },
        // Einrichtungen
        {
            name: 'uebungsanlagen',
            title: 'Übungsanlagen',
            type: 'array',
            of: [{
                type: 'string',
                options: {
                    list: [
                        'Driving Range',
                        'Putting Green',
                        'Chipping Area',
                        'Übungsplatz',
                        'Pitching Area',
                        'Bunker-Übungsbereich'
                    ]
                }
            }],
            group: 'einrichtungen'
        },
        {
            name: 'services',
            title: 'Services',
            type: 'object',
            group: 'einrichtungen',
            fields: [
                { name: 'golfschule', title: 'Golfschule', type: 'boolean' },
                { name: 'proShop', title: 'Pro-Shop', type: 'boolean' },
                { name: 'restaurant', title: 'Restaurant', type: 'boolean' },
                { name: 'umkleide', title: 'Umkleide', type: 'boolean' },
                { name: 'sanitaeranlagen', title: 'Sanitäranlagen', type: 'boolean' },
                { name: 'leihausruestung', title: 'Leihausrüstung', type: 'boolean' },
                { name: 'cartVermietung', title: 'Cart-Vermietung', type: 'boolean' }
            ]
        },
        // Club-Informationen
        {
            name: 'mitgliedschaft',
            title: 'Mitgliedschaft',
            type: 'object',
            group: 'club',
            fields: [
                { name: 'moeglich', title: 'Mitgliedschaft möglich', type: 'boolean' },
                { name: 'aufnahmegebuehr', title: 'Aufnahmegebühr', type: 'boolean' },
                { name: 'warteliste', title: 'Warteliste', type: 'boolean' },
                { name: 'schnuppermitgliedschaft', title: 'Schnuppermitgliedschaft', type: 'boolean' }
            ]
        },
        {
            name: 'turniere',
            title: 'Turniere & Events',
            type: 'object',
            group: 'club',
            fields: [
                { name: 'gaeste', title: 'Turniere für Gäste', type: 'boolean' },
                { name: 'club', title: 'Clubturniere', type: 'boolean' },
                { name: 'rangliste', title: 'Ranglistenturniere', type: 'boolean' }
            ]
        },
        {
            name: 'kooperationen',
            title: 'Kooperationen',
            type: 'array',
            of: [{
                type: 'reference',
                to: [{ type: 'kooperation' }]
            }],
            group: 'club'
        }
    ]
};