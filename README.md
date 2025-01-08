# Golf Portal

Ein zentrales Verzeichnis für deutsche Golfclubs mit Freemium-Modell.

## Projektstruktur

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Authentication Routes
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/        # Dashboard Routes
│   │   ├── clubs/
│   │   ├── profile/
│   │   └── settings/
│   ├── (marketing)/        # Marketing Routes
│   │   ├── ads/
│   │   └── analytics/
│   └── studio/            # Sanity Studio
├── components/            # UI Komponenten
│   ├── auth/             # Auth-spezifische Komponenten
│   ├── clubs/            # Club-spezifische Komponenten
│   ├── dashboard/        # Dashboard-spezifische Komponenten
│   ├── marketing/        # Marketing-spezifische Komponenten
│   └── catalyst-ui-kit/  # UI Framework
├── lib/                  # Service Integrationen
│   ├── sanity/          # Sanity CMS Client
│   ├── stripe.ts        # Payment Integration
│   ├── sendgrid.ts      # Email Service
│   ├── twilio.ts        # SMS Service
│   └── analytics.ts     # Analytics Setup
├── sanity/              # Sanity Konfiguration
│   ├── schemaTypes/     # Content Modelle
│   │   ├── golfclub.ts  # Hauptschema für Golfclubs
│   │   ├── administrator.ts # Administratoren-Schema
│   │   ├── vertragsmodell.ts # Vertragsmodell-Schema
│   │   ├── feature.ts   # Features für Vertragsmodelle
│   │   ├── land.ts      # Länder-Schema
│   │   ├── kooperation.ts # Kooperationen-Schema
│   │   └── index.ts     # Schema-Exports
│   ├── env.ts          # Sanity Environment
│   └── structure.ts    # Sanity Structure
└── utils/              # Hilfsfunktionen
    ├── api.ts          # API Utilities
    ├── auth.ts         # Auth Utilities
    └── helpers.ts      # Allgemeine Utilities
```

## Content Modelle

Das Portal verwendet folgende Hauptschemas:

### Golfclub
- Basis-Informationen (Name, Kontakt, SEO)
- Bilder (Logo, Titelbild, Galerie)
- Platz-Details (Löcher, Par, Rating, etc.)
- Einrichtungen (Übungsanlagen, Services)
- Club-Informationen (Mitgliedschaft, Turniere)

### Vertragsmodell & Features
- Verschiedene Mitgliedschaftsmodelle (Free/Premium)
- Definierbare Features pro Modell
- Preisgestaltung und Zahlungsintervalle

### Kooperationen
- Verbundmitgliedschaften
- Greenfee-Ermäßigungen
- Partnerschaftsprogramme


## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS + Catalyst UI Kit
- Sanity CMS + NextAuth
- Stripe Payments
- SendGrid Email
- Twilio Messaging
- Plausible Analytics

## Umgebungsvariablen (.env.local)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
NEXTAUTH_SANITY_WEBHOOK_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
SENDGRID_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

## Installation

```bash
git clone https://github.com/AImitSK/golf-portal.git
cd golf-portal
npm install
```

## Entwicklung

```bash
npm run dev
```

## Features

- Club Verwaltung
- Premium Mitgliedschaften
- Regionale Werbung
- Analytics Dashboard
- Email/SMS Benachrichtigungen
- Authentifizierung via Sanity

## Google Maps

// Eine GROQ-Abfrage für Sanity, die alle Golfclubs in einem 50km Radius um Hannover findet
```
const query = `*[_type == "golfclub" && defined(adresse.location) && geo::distance(adresse.location, geo::latLon(52.3759, 9.7320)) < 50000] {
  title,
  "distance": geo::distance(adresse.location, geo::latLon(52.3759, 9.7320)),
  adresse
}`
```

// Verwendung mit dem Sanity Client
const golfclubsNearHannover = await client.fetch(query)

// Sortiert nach Entfernung
golfclubsNearHannover.sort((a, b) => a.distance - b.distance)

## Grid Abfrage

```
const filters = {
titleFilter: "Berlin Golf",        // Finde Golfplätze mit "Berlin Golf" im Titel
anzahlLoecher: 18,                // 18-Loch-Platz
platztypFilter: "Mountain Course", // Platztypen filtern
hatRestaurant: true,              // Nur Clubs mit Restaurant
hatGolfschule: true,              // Nur Clubs mit Golfschule
maxSlope: 140,                    // Maximaler Schwierigkeitswert (Slope)
minCourseRating: 72               // Mindestrating von 72
};

const filteredClubs = await client.fetch(query, filters);

// Ausgabe der Ergebnisse
console.log(filteredClubs);
```

### Dynamische Unterschiede

Wenn Filter nicht gesetzt sind:
- Die !defined(...)-Abfrage sorgt dafür, dass Kriterien wie $hatRestaurant ignoriert werden, wenn sie nicht definiert oder leer sind.
- Dies macht die Abfrage flexibel für unterschiedlich umfassende Filter.

Verschiedene Sub-Felder:
- Sub-Felder wie services.restaurant (z. B. true oder false) können direkt in den Filtern abgefragt werden.
- Default-Werte wie services.restaurant == $hatRestaurant || !defined($hatRestaurant) stellen sicher, dass keine unerwünschten Filterfehler auftreten.
