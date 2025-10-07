// import { redirect } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isValidMagicLinkToken } from '$lib/server/magiclink';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (typeof token !== 'string' || token.length === 0) {
		return redirect(302, '/auth/signup');
	}

	try {
		const isValid = await isValidMagicLinkToken(token);

		if (!isValid) {
			console.log('Invalid or expired token');
			return redirect(302, '/auth/login?error=invalid_token');
		}
	} catch (e) {
		console.error('Error validating token', e);
		return redirect(302, '/auth/login?error=server_error');
	}

	// create lucia session

	console.log('Token is valid, user logged in ', token);
	return redirect(302, '/home');
};
