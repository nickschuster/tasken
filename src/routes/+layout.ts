import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY as POSTHOG_KEY } from '$env/static/public';

export function _initTelemetry() {
	if (!browser) {
		return;
	}

	posthog.init(POSTHOG_KEY, {
		api_host: '/relay-5HTB',
		ui_host: 'https://us.posthog.com',
		person_profiles: 'always',
		persistence: 'localStorage'
	});
}

_initTelemetry();
