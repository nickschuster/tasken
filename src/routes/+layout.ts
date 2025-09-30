import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY as POSTHOG_KEY, PUBLIC_CI as CI, PUBLIC_DEV as DEV } from '$env/static/public';

export function _initTelemetry() {
	if (!browser || !POSTHOG_KEY || CI || DEV) {
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
