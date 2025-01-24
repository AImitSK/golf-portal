// src/lib/sendgrid.ts
import sgMail from "@sendgrid/mail";
import { SendGridTemplate } from "@/types/email";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
export default sgMail;

export async function sendClaimConfirmationEmail({
                                                     to,
                                                     clubName,
                                                     adminName,
                                                 }: {
    to: string;
    clubName: string;
    adminName: string;
}) {
    const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL!,
        templateId: SendGridTemplate.INVOICE_NOTIFICATION, // Ersetzen Sie CLAIM_CONFIRMATION mit einem gültigen Wert aus SendGridTemplate
        dynamicTemplateData: {
            clubName,
            adminName,
            loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/club-backend`,
        },
    };

    return sgMail.send(msg);
}