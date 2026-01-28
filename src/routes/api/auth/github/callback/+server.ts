import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { githubOAuth } from '$lib/server/oauth';
import { upsertUserByEmail } from '$lib/server/users';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');
  const storedState = event.cookies.get('github_oauth_state') ?? null;

  let githubUserEmail: string;
  try {
    if (code === null || state === null || storedState === null) {
      throw new Error('Missing parameters in GitHub OAuth callback');
    }
    if (state !== storedState) {
      throw new Error('Invalid state in GitHub OAuth callback');
    }

    const tokens = await githubOAuth.validateAuthorizationCode(code);

    const githubUserResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`
      }
    });
    const githubUserEmails = await githubUserResponse.json();
    githubUserEmail = githubUserEmails.find(
      (e: { primary: boolean; email: string }) => e.primary
    ).email;

    if (!githubUserEmail) {
      throw new Error('No email found in GitHub user emails');
    }
  } catch (e) {
    console.error(e);

    event.cookies.delete('github_oauth_state', { path: '/' });
    event.cookies.delete('github_oauth_code_verifier', { path: '/' });

    return new Response(null, {
      status: 400
    });
  }

  // TODO: not the best, should use a sub per OAuth provider
  const user = await upsertUserByEmail(githubUserEmail);

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);

  setSessionTokenCookie(event, sessionToken, session.expiresAt);

  event.cookies.delete('github_oauth_state', { path: '/' });
  event.cookies.delete('github_oauth_code_verifier', { path: '/' });

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/home'
    }
  });
}
