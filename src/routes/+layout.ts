import posthog from 'posthog-js';
import { browser } from '$app/environment';
import {
	PUBLIC_POSTHOG_KEY as POSTHOG_KEY,
	PUBLIC_CI as CI,
	PUBLIC_DEV as DEV
} from '$env/static/public';

export function _initTelemetry() {
	console.log('[InitTelementry] veryifing browser, posthog key, ci, and dev');
	if (!browser || !POSTHOG_KEY || CI || DEV) {
		console.error(`[InitTelementry] Check failed CI: ${CI}, DEV: ${DEV}`);
		return;
	}

	console.log('[InitTelementry] Initilizing posthog...');
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
