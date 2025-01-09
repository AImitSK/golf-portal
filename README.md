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


# Datenstruktur und Variablen-Namen für das Golfclub-JSON-Objekt

Hier findest du eine Übersicht aller Felder, die im Golfclub-Objekt verwendet werden, sowie die dazugehörigen Variablen, mit denen du auf die Werte zugreifen kannst:

---

## **Hauptfelder**
| **Feldname**      | **Variable**              | **Beschreibung**                                                                                                        |
|--------------------|---------------------------|------------------------------------------------------------------------------------------------------------------------|
| `seo.title`       | `seo.title`              | Der SEO-Titel, z. B.: `"Golf-Club Widukind-Land e.V."`.                                                                |
| `seo.description` | `seo.description`        | SEO-Beschreibung, z. B.: `"Hier erleben Sie die Exklusivität eines modernen Clubs mit über 30 Jahren Tradition..."`.   |
| `seo.keywords`    | `seo.keywords`           | Liste an Keywords für die SEO-Optimierung.                                                                             |

---

## **Adresse**
| **Feldname**       | **Variable**            | **Beschreibung**                                                                                                       |
|---------------------|-------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `adresse.strasse`   | `adresse.strasse`      | Die Straße des Golfclubs, z. B.: `"Auf dem Stickdorn"`.                                                                |
| `adresse.plz`       | `adresse.plz`          | Die Postleitzahl, z. B.: `32584`.                                                                                      |
| `adresse.ort`       | `adresse.ort`          | Der Ort des Golfclubs, z. B.: `"Löhne/Westf."`.                                                                        |
| `adresse.land.name` | `adresse.land.name`    | Der Name des Landes, z. B.: `"Deutschland"`.                                                                           |
| `adresse.land.code` | `adresse.land.code`    | Der Ländercode, z. B.: `"DE"`.                                                                                         |
| `adresse.location.lat` | `adresse.location.lat` | Die geografische Breite des Golfclubs, z. B.: `52.16487`.                                                              |
| `adresse.location.lng` | `adresse.location.lng` | Die geografische Länge des Golfclubs, z. B.: `8.76076`.                                                                |
| `adresse.location.alt` | `adresse.location.alt` | Die Höhe über dem Meeresspiegel, z. B.: `0` (falls bekannt).                                                           |

---

## **Kontaktinformationen**
| **Feldname**        | **Variable**           | **Beschreibung**                                                                                                       |
|----------------------|------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `clubTelefon`        | `clubTelefon`         | Die Telefonnummer des Golfclubs, z. B.: `"052287050"`.                                                                |
| `clubEmail`          | `clubEmail`           | Die E-Mail-Adresse, z. B.: `"info@gc-widukindland.de"`.                                                               |
| `clubWebsite`        | `clubWebsite`         | Die Website-URL, z. B.: `"https://widukindland.de/"`.                                                                 |

---

## **Besonderheiten**
| **Feldname**        | **Variable**           | **Beschreibung**                                                                                                       |
|----------------------|------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `besonderheiten`     | `besonderheiten`      | Liste mit speziellen Eigenschaften des Golfplatzes, z. B.: `["Bunker", "Waldbereiche", "Doglegs"]`.                   |

---

## **Mitgliedschaft**
| **Feldname**                     | **Variable**                     | **Beschreibung**                                                                                                       |
|-----------------------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `mitgliedschaft.moeglich`         | `mitgliedschaft.moeglich`        | Gibt an, ob eine Mitgliedschaft möglich ist (`true`/`false`).                                                         |
| `mitgliedschaft.schnuppermitgliedschaft` | `mitgliedschaft.schnuppermitgliedschaft` | Gibt an, ob eine Schnuppermitgliedschaft angeboten wird (`true`/`false`).                                            |

---

## **Bilder und Medien**
| **Feldname**                     | **Variable**                     | **Beschreibung**                                                                                                       |
|-----------------------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `image`                           | `image`                         | URL des Hauptbildes des Golfclubs, z. B.: `"https://cdn.sanity.io/.../bfe3ee5007ccd19da01a.jpg"`.                      |
| `bildergalerie[n].asset.url`      | `bildergalerie[n].asset.url`     | URLs der Bilder in der Galerie.                                                                                       |
| `bildergalerie[n].beschreibung`   | `bildergalerie[n].beschreibung`  | Beschreibung des jeweiligen Bildes (kann `null` sein).                                                                |
| `bildergalerie[n].alt`            | `bildergalerie[n].alt`           | Alt-Text für das jeweilige Bild (kann `null` sein).                                                                   |

---

## **Allgemeine Informationen**
| **Feldname**                     | **Variable**                     | **Beschreibung**                                                                                                       |
|-----------------------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `status`                          | `status`                        | Veröffentlicht-Status, z. B.: `"published"`.                                                                           |
| `title`                           | `title`                         | Clubtitel, z. B.: `"Golf-Club Widukind-Land e.V."`.                                                                    |
| `slug`                            | `slug`                          | Slug des Clubs, z. B.: `"golf-club-widukind-land-e-v4"`.                                                               |

---

## **Dienste**
| **Feldname**                     | **Variable**                     | **Beschreibung**                                                                                                       |
|-----------------------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `services.restaurant`             | `services.restaurant`           | Gibt an, ob Restaurantdienste verfügbar sind (`true`/`false`).                                                        |
| `services.umkleide`               | `services.umkleide`             | Gibt an, ob Umkleideräume verfügbar sind (`true`/`false`).                                                            |
| `services.sanitaeranlagen`        | `services.sanitaeranlagen`      | Gibt an, ob Sanitäranlagen verfügbar sind (`true`/`false`).                                                           |
| `services.leihausruestung`        | `services.leihausruestung`      | Gibt an, ob Leihausrüstungen verfügbar sind (`true`/`false`).                                                         |
| `services.cartVermietung`         | `services.cartVermietung`       | Gibt an, ob Golf-Carts vermietet werden (`true`/`false`).                                                             |
| `services.golfschule`             | `services.golfschule`           | Gibt an, ob eine Golfschule angeboten wird (`true`/`false`).                                                          |
| `services.proShop`                | `services.proShop`              | Gibt an, ob ein Pro-Shop vorhanden ist (`true`/`false`).                                                              |

---

## **Zusätzliche Felder**
| **Feldname**                     | **Variable**                     | **Beschreibung**                                                                                                       |
|-----------------------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `vertragsBeginn`                  | `vertragsBeginn`                | Startdatum des Vertrags, z. B.: `"2025-01-01"`.                                                                        |
| `vertragsEnde`                    | `vertragsEnde`                  | Enddatum des Vertrags, z. B.: `"2026-01-09"`.                                                                          |
| `anzahlLoecher`                   | `anzahlLoecher`                 | Anzahl der Löcher, z. B.: `18`.                                                                                        |
| `parGesamt`                       | `parGesamt`                     | Par-Wert des Golfplatzes, z. B.: `72`.                                                                                 |
| `platztyp`                        | `platztyp`                      | Typ des Golfplatzes, z. B.: `"Mountain Course"`.                                                                       |
| `turniere.club`                   | `turniere.club`                 | Gibt an, ob Clubturniere stattfinden (`true`/`false`).                                                                 |
| `turniere.gaeste`                 | `turniere.gaeste`               | Gibt an, ob Gastturniere stattfinden (`true`/`false`).                                                                 |
| `courseRating`                    | `courseRating`                  | Platzbewertung, z. B.: `815`.                                                                                         |
| `slope`                           | `slope`                         | Slope-Wert, z. B.: `815`.                                                                                              |

---

### **Hinweise**
- Felder wie `bildergalerie.beschreibung` und `bildergalerie.alt` können `null` sein, es empfiehlt sich daher eine Fallback-Lösung im Code.
- Die Struktur und Variablen-Namen basieren auf den JSON-Daten aus der Eingabe.

---

Wenn du das ergänzt oder verfeinert haben möchtest, lass es mich wissen! 😊