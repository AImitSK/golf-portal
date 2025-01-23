// src/lib/email-templates/invoice.ts
import { SendGridTemplate } from "@/types/email";

export async function sendInvoiceEmail({
                                           to,
                                           clubName,
                                           invoiceNumber,
                                           amount,
                                           downloadUrl,
                                       }: {
    to: string;
    clubName: string;
    invoiceNumber: string;
    amount: number;
    downloadUrl: string;
}) {
    const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL!,
        templateId: SendGridTemplate.INVOICE_NOTIFICATION,
        dynamicTemplateData: {
            clubName,
            invoiceNumber,
            amount: (amount / 100).toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
            }),
            downloadUrl,
            loginUrl: `${process.env.NEXT_PUBLIC_URL}/auth/login`,
            dashboardUrl: `${process.env.NEXT_PUBLIC_URL}/club-backend/administration/abonnement-rechnungen`
        },
    };

    return sgMail.send(msg);
}