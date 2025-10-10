import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getEmailFromMagicLinkToken, isValidMagicLinkToken } from '$lib/server/magiclink';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { UUIDV4 } from '$lib/server/helper';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/home');
	}

	const token = event.url.searchParams.get('token');

	if (typeof token !== 'string' || token.length === 0) {
		return redirect(302, '/auth/signup');
	}

	try {
		const isValid = await isValidMagicLinkToken(token);

		if (!isValid) {
			console.log('Invalid or expired token');
			return redirect(302, '/auth/signup');
		}

		const { email } = await getEmailFromMagicLinkToken(token);

		if (!email) {
			console.log('No email found');
			return redirect(302, '/auth/signup');
		}

		let [user] = await db.select().from(table.user).where(eq(table.user.email, email));

		if (!user) {
			const userId = UUIDV4();

			[user] = await db.insert(table.user).values({ id: userId, email }).returning();
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} catch (e) {
		console.error('Server error', e);
		return redirect(302, '/auth/signup');
	}

	return redirect(302, '/home');
};
