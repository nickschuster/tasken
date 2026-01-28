import type { Handle, RequestEvent } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

const handleAuth: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (pathname.includes('relay-5HTB')) {
    return buildPostHogRelayResponse(pathname, event);
  }

  const sessionToken = event.cookies.get(auth.sessionCookieName);

  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await auth.validateSessionToken(sessionToken);

  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    auth.deleteSessionTokenCookie(event);
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};

async function buildPostHogRelayResponse(pathname: string, event: RequestEvent) {
  // Determine target hostname based on static or dynamic ingestion
  const hostname = pathname.startsWith('/relay-5HTB/static/')
    ? 'us-assets.i.posthog.com' // change us to eu for EU Cloud
    : 'us.i.posthog.com'; // change us to eu for EU Cloud

  // Build external URL
  const url = new URL(event.request.url);
  url.protocol = 'https:';
  url.hostname = hostname;
  url.port = '443';
  url.pathname = pathname.replace('/relay-5HTB/', '');

  // Clone and adjust headers
  const headers = new Headers(event.request.headers);

  if (headers.get('connection')) {
    headers.delete('connection');
  }

  headers.set('Accept-Encoding', '');
  headers.set('host', hostname);

  let response: Response;
  try {
    // Proxy the request to the external host
    response = await fetch(url.toString(), {
      method: event.request.method,
      headers,
      body: event.request.body,
      duplex: 'half'
    } as RequestInit);
  } catch (error) {
    console.error('Error during fetch to PostHog:', error);

    response = new Response('Error proxying request to PostHog', { status: 502 });
  }

  return response;
}

export const handle: Handle = handleAuth;
