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
│   ├── env.ts          # Sanity Environment
│   └── structure.ts    # Sanity Structure
└── utils/              # Hilfsfunktionen
    ├── api.ts          # API Utilities
    ├── auth.ts         # Auth Utilities
    └── helpers.ts      # Allgemeine Utilities
```

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