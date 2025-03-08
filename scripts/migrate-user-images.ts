// scripts/migrate-user-images.ts
const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');

// Lade Umgebungsvariablen
dotenv.config({ path: '.env.local' });

// Konfiguriere den Sanity-Client
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN, // Benötigt ein Token mit Schreibrechten
    useCdn: false,
    apiVersion: '2023-05-03'
});

async function migrateUserImages() {
    console.log('🔄 Starte Migration der Benutzerbilder...');

    try {
        // Finde alle Benutzer und Administratoren mit Bildern, die URLs sind
        const query = `*[
      (_type == "user" || _type == "administrator") && 
      defined(image) && 
      image match "http*"
    ]`;

        const users = await client.fetch(query);

        console.log(`📊 ${users.length} Benutzer mit URL-Bildern gefunden`);

        if (users.length === 0) {
            console.log('✅ Keine Benutzer zu migrieren gefunden');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const user of users) {
            try {
                console.log(`🔄 Migriere Benutzer: ${user._id} (${user.email || 'ohne E-Mail'})`);

                // Für jeden Benutzer mit einer Bild-URL:
                // - Speichere die URL in imageUrl
                // - Setze image auf undefined
                await client
                    .patch(user._id)
                    .set({
                        imageUrl: user.image,
                        image: undefined // Entferne das image-Feld, wenn es eine URL ist
                    })
                    .commit();

                console.log(`✅ Benutzer ${user._id} erfolgreich migriert`);
                successCount++;
            } catch (error) {
                console.error(`❌ Fehler bei der Migration von ${user._id}:`, error);
                errorCount++;
            }
        }

        console.log('📝 Migrations-Zusammenfassung:');
        console.log(`   - Erfolgreich migriert: ${successCount}`);
        console.log(`   - Fehlgeschlagen: ${errorCount}`);
        console.log('✅ Migration abgeschlossen');
    } catch (error) {
        console.error('❌ Fehler bei der Migration:', error);
        throw error;
    }
}

// Führe die Migration aus
migrateUserImages()
    .then(() => {
        console.log('✨ Migrations-Skript erfolgreich ausgeführt');
        process.exit(0);
    })
    .catch(err => {
        console.error('💥 Migrations-Skript fehlgeschlagen:', err);
        process.exit(1);
    });