import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export const sendEmail = async (to: string[], subject: string, html: string) => {
	return await resend.emails.send({
		from: 'onboarding@resend.dev',
		to,
		subject,
		html
	});
};
