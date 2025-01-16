import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Bestätigen Sie Ihre Email-Adresse',
    text: `Bitte bestätigen Sie Ihre Email-Adresse: ${confirmLink}`, // Plain text version
    html: `
      <div style="padding: 20px; background-color: #ffffff;">
        <h1 style="color: #006633;">Email-Adresse bestätigen</h1>
        <p>
          Vielen Dank für Ihre Registrierung. Bitte klicken Sie auf den folgenden Link, um Ihre Email-Adresse zu bestätigen.
        </p>
        <a href="${confirmLink}">${confirmLink}</a>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log('Verification email sent');
    return true;
  } catch (error: any) {
    console.error('Error sending verification email:', {
      error: error,
      response: error.response?.body
    });
    throw new Error("Failed to send verification email");
  }
};