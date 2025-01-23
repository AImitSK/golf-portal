// src/types/email.ts
export enum SendGridTemplate {
    CLAIM_CONFIRMATION = 'd-f51149010d2646cdb5ea014644a66c03', // Hier Template-ID einfügen
}

export interface EmailData {
    to: string;
    templateId: SendGridTemplate;
    dynamicTemplateData: Record<string, string>;
}