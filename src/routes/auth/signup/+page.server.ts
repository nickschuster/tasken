import {
	generateMagicLinkToken,
	sendMagicLinkEmail,
	storeMagicLink
} from '$lib/server/magiclink.js';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		if (typeof email !== 'string' || email.length === 0) {
			return fail(400, { error: 'Email is required' });
		}

		const token = generateMagicLinkToken();

		try {
			await storeMagicLink(email, token);
			await sendMagicLinkEmail(email, token);
		} catch {
			return fail(500, { error: 'An unexpected error occurred. Please try again later.' });
		}

		return { success: true, message: 'Magic link sent to ' + email };
	}
};
