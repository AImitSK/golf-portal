# Golf Portal

Ein zentrales Verzeichnis für deutsche Golfclubs mit Freemium-Modell.

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS + Catalyst UI Kit
- Sanity CMS + NextAuth Integration
- Stripe Payments
- SendGrid Email
- Twilio Messaging
- Plausible Analytics

## Installation

```bash
npm install
```

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

## Features

- Club Verwaltung
- Premium Mitgliedschaften
- Regionale Werbung
- Analytics Dashboard
- Email/SMS Benachrichtigungen
- Authentifizierung via Sanity

## Entwicklung

```bash
npm run dev
```