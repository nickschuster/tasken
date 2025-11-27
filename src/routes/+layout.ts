import posthog from 'posthog-js';
import { browser } from '$app/environment';
import {
	PUBLIC_POSTHOG_KEY as POSTHOG_KEY,
	PUBLIC_CI as CI,
	PUBLIC_DEV as DEV
} from '$env/static/public';

export function _initTelemetry() {
	const isCI = CI === 'true';
	const isDev = DEV === 'true';

	if (!browser || !POSTHOG_KEY || isCI || isDev) {
		return;
	}

	posthog.init(POSTHOG_KEY, {
		api_host: '/relay-5HTB',
		ui_host: 'https://us.posthog.com',
		person_profiles: 'always',
		persistence: 'localStorage'
	});

	console.log('[InitTelementry] Success! Posthog Initialized');

	posthog.on('eventCaptured', (evt) => {
		console.log('[PostHog Debug] Event fired on client:', evt);
	});
}

_initTelemetry();
