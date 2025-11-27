import type { Handle, RequestEvent } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

const handleAuth: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname.includes('relay-5HTB')) {
		console.log('[Auth Hook] Pathname included relay-5HTB, building posthog response relay...');
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

	console.log(`[ResponseRelay] Selected posthog hostname: ${hostname}`);

	// Build external URL
	const url = new URL(event.request.url);
	url.protocol = 'https:';
	url.hostname = hostname;
	url.port = '443';
	url.pathname = pathname.replace('/relay-5HTB/', '');

	console.log(`[ResponseRelay] Built external URL: ${url}`);
	console.log(`[ResponseRelay] Final proxied path: ${url.pathname}`);

	// Clone and adjust headers
	const headers = new Headers(event.request.headers);
	headers.set('Accept-Encoding', '');
	headers.set('host', hostname);

	console.log(`[ResponseRelay] Proxying request to external host`);

	// Proxy the request to the external host
	const response = await fetch(url.toString(), {
		method: event.request.method,
		headers,
		body: event.request.body,
		duplex: 'half'
	} as RequestInit);

	console.log(`[ResponseRelay] PostHog responded with ${response.status} ${response.statusText}`);

	if (!response.ok) {
		const txt = await response.text();
		console.log(`[ResponseRelay] Error body: ${txt}`);
	}

	console.log('[ResponseRelay] Successfully created response. Returning...');
	return response;
}

export const handle: Handle = handleAuth;
