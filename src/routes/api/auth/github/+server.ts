import { generateState } from 'arctic';
import type { RequestEvent } from './$types';
import { githubOAuth } from '$lib/server/oauth';

export async function GET(event: RequestEvent) {
  const state = generateState();
  const authorizationUrl = githubOAuth.createAuthorizationURL(state, ['read:user', 'user:email']);

  event.cookies.set('github_oauth_state', state, {
    path: '/',
    httpOnly: true,
    maxAge: 300, // 5 minutes
    sameSite: 'lax'
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationUrl.toString()
    }
  });
}
