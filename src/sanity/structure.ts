// src/sanity/structure.ts
import type { StructureBuilder } from 'sanity/desk';

export const structure = (S: StructureBuilder) =>
    S.list()
        .title('Inhalte')
        .items([
            // Golfclubs
            S.listItem()
                .title('Golfclubs')
                .child(
                    S.documentList()
                        .title('Golfclubs')
                        .filter('_type == "golfclub"')
                ),

            // Kooperationen
            S.listItem()
                .title('Kooperationen')
                .child(
                    S.documentList()
                        .title('Kooperationen')
                        .filter('_type == "kooperation"')
                ),

            // Benutzer
            S.listItem()
                .title('Benutzer')
                .child(
                    S.documentList()
                        .title('Benutzer')
                        .filter('_type == "user"')
                ),

            // Administratoren
            S.listItem()
                .title('Administratoren')
                .child(
                    S.documentList()
                        .title('Administratoren')
                        .filter('_type == "administrator"')
                ),

            // Vertragsmodelle
            S.listItem()
                .title('Vertragsmodelle')
                .child(
                    S.documentList()
                        .title('Vertragsmodelle')
                        .filter('_type == "vertragsmodell"')
                ),

            // Features
            S.listItem()
                .title('Features')
                .child(
                    S.documentList()
                        .title('Features')
                        .filter('_type == "feature"')
                ),

            // Länder
            S.listItem()
                .title('Länder')
                .child(
                    S.documentList()
                        .title('Länder')
                        .filter('_type == "land"')
                ),

            // Standard-Liste für alle anderen Dokumente
            S.divider(),
            ...S.documentTypeListItems().filter(
                listItem => !['golfclub', 'kooperation', 'user', 'administrator', 'vertragsmodell', 'feature', 'land'].includes(listItem.getId() || '')
            )
        ])