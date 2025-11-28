import { browser } from '$app/environment';
import posthog from 'posthog-js';

class PostHog {
	private static getPostHog() {
		if (!browser) {
			return null;
		}

		return posthog;
	}

	static reset() {
		this.getPostHog()?.reset();
	}

	static identify(userId: string, properties: Record<string, unknown>) {
		this.getPostHog()?.identify(userId, properties);
	}

	static capture(eventName: string, properties: Record<string, unknown>) {
		this.getPostHog()?.capture(eventName, properties);
	}
}

export { PostHog };
