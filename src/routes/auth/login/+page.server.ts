// import { redirect } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isValidMagicLinkToken } from '$lib/server/magiclink';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (typeof token !== 'string' || token.length === 0) {
		return redirect(302, '/auth/signup');
	}

	if (!isValidMagicLinkToken(token)) {
		return redirect(302, '/auth/signup');
	}

	// switch on token type (oauth, magic link etc)
	return redirect(302, '/home');
};
