// src/types/sanity-declarations.d.ts

declare module 'sanity/structure' {
    export const structureTool: any;
}

declare module 'sanity' {
    export function defineConfig(config: any): any;
    export type DocumentActionComponent = (props: any) => any;
    export interface DocumentActionsContext {
        schemaType: string;
        documentId: string;
    }
}

declare module '@sanity/vision' {
    export const visionTool: (options?: { defaultApiVersion?: string }) => any;
}