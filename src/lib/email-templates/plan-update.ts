// src/lib/email-templates/plan-update.ts
import { SendGridTemplate } from "@/types/email";
import sgMail from "@/lib/sendgrid";

export async function sendPlanUpdateEmail({
                                              to,
                                              clubName,
                                              planName,
                                              amount,
                                              startDate,
                                          }: {
    to: string;
    clubName: string;
    planName: string;
    amount: number;
    startDate: Date;
}) {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL!,
            templateId: SendGridTemplate.PLAN_UPDATE,
            dynamicTemplateData: {
                clubName,
                planName,
                amount: (amount / 100).toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                }),
                startDate: startDate.toLocaleDateString('de-DE'),
                dashboardUrl: `${process.env.NEXT_PUBLIC_URL}/club-backend/administration/abonnement-rechnungen`
            },
        };

        await sgMail.send(msg);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
}