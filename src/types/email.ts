// src/types/email.ts
export const SendGridTemplate = {
    INVOICE_NOTIFICATION: 'd-82a9eef2929a440ebd073f0424143d5b'
} as const;

export type SendGridTemplateType = keyof typeof SendGridTemplate;

export interface EmailData {
    to: string;
    templateId: typeof SendGridTemplate[keyof typeof SendGridTemplate];
    dynamicTemplateData: Record<string, string>;
}