// sanity/actions/GeocodeAction.ts
import { useState } from 'react'
import { useClient } from 'sanity'
import type { DocumentActionComponent, DocumentActionProps, SanityDocument } from 'sanity'
import { useGoogleMaps } from '@/hooks/useGoogleMaps'

interface GeoPoint {
    _type: 'geopoint'
    lat: number
    lng: number
    alt?: number
}

interface Address {
    strasse: string
    hausnummer: string
    plz: string | number
    ort: string
    location?: GeoPoint
}

interface GolfclubDocument extends SanityDocument {
    adresse?: Address
}

async function getCoordinates(address: string): Promise<GeoPoint | null> {
    console.log('getCoordinates aufgerufen mit Adresse:', address)

    if (!window.google?.maps) {
        console.error('Google Maps ist nicht geladen!')
        return null
    }
    console.log('Google Maps ist verfügbar')

    const geocoder = new google.maps.Geocoder()
    console.log('Geocoder erstellt')

    try {
        console.log('Starte Geocoding-Anfrage...')
        const response = await geocoder.geocode({
            address: address
        })
        console.log('Geocoding-Antwort erhalten:', response)

        if (response.results[0]) {
            const { lat, lng } = response.results[0].geometry.location
            const coordinates: GeoPoint = {
                _type: 'geopoint',
                lat: lat(),
                lng: lng(),
                alt: 0
            }
            console.log('Koordinaten extrahiert:', coordinates)
            return coordinates
        } else {
            console.log('Keine Ergebnisse für diese Adresse gefunden')
        }
    } catch (error) {
        console.error('Geocoding fehlgeschlagen:', error)
    }

    return null
}

const GeocodeAction = (props: DocumentActionProps) => {
    const { draft, published, onComplete } = props
    const doc = (draft || published) as GolfclubDocument | undefined
    const client = useClient({ apiVersion: '2023-01-01' })
    const isGoogleMapsLoaded = useGoogleMaps()
    const [isLoading, setIsLoading] = useState(false)

    console.log('GeocodeAction Component gerendert:', {
        hasDoc: !!doc,
        hasAddress: !!doc?.adresse,
        isGoogleMapsLoaded,
        isLoading,
        documentId: doc?._id
    })

    if (!isGoogleMapsLoaded) {
        console.log('Warte auf Google Maps...')
        return {
            label: 'Koordinaten aktualisieren',
            disabled: true,
            title: 'Warte auf Google Maps...'
        }
    }

    async function geocodeAddress() {
        console.log('geocodeAddress Funktion aufgerufen')

        if (!doc?.adresse) {
            console.log('Keine Adresse im Dokument vorhanden')
            return
        }

        setIsLoading(true)
        console.log('Starte Geocoding für:', doc.adresse)

        try {
            const addressString = `${doc.adresse.strasse} ${doc.adresse.hausnummer}, ${doc.adresse.plz} ${doc.adresse.ort}, Deutschland`
            console.log('Generierte Adress-String:', addressString)

            const coordinates = await getCoordinates(addressString)
            console.log('Erhaltene Koordinaten:', coordinates)

            if (coordinates) {
                console.log('Versuche Dokument zu aktualisieren. Dokument ID:', doc._id)
                await client
                    .patch(doc._id)
                    .set({
                        'adresse.location': coordinates
                    })
                    .commit()
                console.log('Dokument erfolgreich aktualisiert')
                onComplete()
            } else {
                console.log('Keine Koordinaten erhalten, Update übersprungen')
            }
        } catch (error) {
            console.error('Fehler beim Update des Dokuments:', error)
        } finally {
            setIsLoading(false)
            console.log('Geocoding-Vorgang abgeschlossen')
        }
    }

    if (!isGoogleMapsLoaded) {
        return {
            label: 'Koordinaten aktualisieren (Lädt...)',
            disabled: true,
            title: 'Warte auf Google Maps...',
            onHandle: () => {
                console.log('Button wurde geklickt, aber Maps lädt noch')
            }
        }
    }

    return {
        label: 'Koordinaten aktualisieren',
        onHandle: () => {
            console.log('Button wurde geklickt!')
            return geocodeAddress()
        },
        disabled: isLoading || !doc?.adresse,
        title: isLoading ? 'Aktualisiere Koordinaten...' : 'Klicken um Koordinaten zu aktualisieren'
    }
}

export const action: DocumentActionComponent = GeocodeAction