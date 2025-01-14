import type {StructureResolver} from 'sanity/structure'

// Liste der Dokumenttypen, die wir ausblenden möchten
const hiddenDocTypes = ['account', 'session', 'verificationToken']

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Filter die Dokumenttypen und zeige nur die an, die nicht in hiddenDocTypes sind
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenDocTypes.includes(listItem.getId() as string)
      )
    ])
