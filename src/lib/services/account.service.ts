import { PostHog } from './posthog.service';
import { wsService } from './ws.service';

export const accountDelete = async () => {
  try {
    const response = await fetch(`/api/account`, {
      method: 'DELETE'
    });

    if (response.ok) {
      wsService.setShouldReconnect(false);
      window.location.href = '/';
    }
  } catch (e) {
    console.error('Error deleting account', e);
  }
};

export const logoutPost = async () => {
  try {
    const response = await fetch('?/logout', {
      method: 'POST',
      body: '',
      headers: {
        'x-sveltekit-action': 'true'
      }
    });

    const body = await response.json();

    if (response.ok) {
      wsService.setShouldReconnect(false);

      PostHog.reset();
    }

    if (body.status === 302) {
      window.location.href = body.location;
    }
  } catch (e) {
    console.error('Logout failed', e);
  }
};
