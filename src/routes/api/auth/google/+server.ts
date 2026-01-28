import { generateCodeVerifier, generateState } from 'arctic';
import type { RequestEvent } from './$types';
import { googleOAuth } from '$lib/server/oauth';

export async function GET(event: RequestEvent) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const authorizationUrl = googleOAuth.createAuthorizationURL(state, codeVerifier, [
    'openid',
    'profile',
    'email'
  ]);

  event.cookies.set('google_oauth_state', state, {
    path: '/',
    httpOnly: true,
    maxAge: 300, // 5 minutes
    sameSite: 'lax'
  });

  event.cookies.set('google_oauth_code_verifier', codeVerifier, {
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
