import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_FROM_EMAIL } from '$env/static/private';
import { EmailSubjects, EmailType } from '$lib/models/email';
import fs from 'fs';
import path from 'path';

const resend = new Resend(RESEND_API_KEY);

export const sendEmail = async (
	to: string[],
	template: EmailType,
	variables: Record<string, string>
) => {
	const html = renderTemplate(loadTemplate(template), variables);

	const subject = EmailSubjects[template];

	const from = RESEND_FROM_EMAIL || 'no-reply@example.com';

	const fromWithName = `Tasken <${from}>`;

	return await resend.emails.send({
		from: fromWithName,
		to,
		subject,
		html
	});
};

const renderTemplate = (html: string, variables: Record<string, string>) => {
	for (const [key, value] of Object.entries(variables)) {
		html = html.replaceAll(`{{${key}}}`, value);
	}

	return html;
};

const loadTemplate = (template: EmailType) => {
	const filePath = path.resolve('src/lib/server/emails/templates', `${template}.html`);
	return fs.readFileSync(filePath, 'utf-8');
};
