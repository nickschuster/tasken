import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { githubOAuth } from '$lib/server/oauth';
import { upsertUserByEmail } from '$lib/server/users';
import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	let tokens: OAuth2Tokens;
	try {
		if (code === null || state === null || storedState === null) {
			throw new Error('Missing parameters in GitHub OAuth callback');
		}
		if (state !== storedState) {
			throw new Error('Invalid state in GitHub OAuth callback');
		}

		tokens = await githubOAuth.validateAuthorizationCode(code);
	} catch (e) {
		console.error(e);

		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUserEmails = await githubUserResponse.json();
	const githubUserEmail = githubUserEmails.find(
		(e: { primary: boolean; email: string }) => e.primary
	).email;

	// TODO: not the best, should use a sub per OAuth provider
	const user = await upsertUserByEmail(githubUserEmail);

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
