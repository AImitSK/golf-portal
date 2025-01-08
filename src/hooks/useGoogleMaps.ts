// hooks/useGoogleMaps.ts
import { useState, useEffect } from 'react'

// Globaler Status um mehrfaches Laden zu verhindern
let isScriptLoading = false
let isScriptLoaded = false

export function useGoogleMaps() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Wenn Google Maps bereits verfügbar ist
        if (window.google?.maps) {
            setIsLoaded(true)
            isScriptLoaded = true
            return
        }

        // Wenn das Script bereits geladen wird, warten wir
        if (isScriptLoading) {
            const checkGoogleMaps = setInterval(() => {
                if (window.google?.maps) {
                    setIsLoaded(true)
                    isScriptLoaded = true
                    clearInterval(checkGoogleMaps)
                }
            }, 100)
            return () => clearInterval(checkGoogleMaps)
        }

        // Script laden, wenn es noch nicht geladen wird
        const loadGoogleMaps = () => {
            isScriptLoading = true

            const script = document.createElement('script')
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`

            script.onload = () => {
                setIsLoaded(true)
                isScriptLoaded = true
                isScriptLoading = false
            }

            script.onerror = () => {
                console.error('Fehler beim Laden von Google Maps')
                isScriptLoading = false
            }

            document.head.appendChild(script)
        }

        if (!isScriptLoaded && !isScriptLoading) {
            loadGoogleMaps()
        }

        // Cleanup
        return () => {
            // Optional: Cleanup-Logic hier
        }
    }, [])

    return isLoaded
}