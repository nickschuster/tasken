import type { RequestEvent } from './$types';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { googleOAuth } from '$lib/server/oauth';
import { decodeIdToken } from 'arctic';
import type { OAuth2Tokens } from 'arctic';
import { upsertUserByEmail } from '$lib/server/users';

export async function GET(event: RequestEvent) {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_oauth_code_verifier') ?? null;

	let tokens: OAuth2Tokens;
	try {
		if (code === null || state === null || storedState === null || codeVerifier === null) {
			throw new Error('Missing parameters in Google OAuth callback');
		}

		if (state !== storedState) {
			throw new Error('Invalid state in Google OAuth callback');
		}

		tokens = await googleOAuth.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		console.error(e);

		event.cookies.delete('google_oauth_state', { path: '/' });
		event.cookies.delete('google_code_verifier', { path: '/' });

		return new Response(null, {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken()) as {
		email: string;
	};

	const googleUserEmail = claims.email;

	// TODO: not the best, should use a sub per OAuth provider
	const user = await upsertUserByEmail(googleUserEmail);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);

	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/home'
		}
	});
}
