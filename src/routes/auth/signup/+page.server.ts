import {
  generateMagicLinkToken,
  sendMagicLinkEmail,
  storeMagicLink
} from '$lib/server/magiclink.js';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_DEV } from '$env/static/public';
import { upsertUserByEmail } from '$lib/server/users';
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/home');
  }
  return {};
};

export const actions = {
  default: async (event) => {
    const { request } = event;

    const formData = await request.formData();
    const email = formData.get('email');

    if (typeof email !== 'string' || email.length === 0) {
      return fail(400, { error: 'Email is required' });
    }

    if (PUBLIC_DEV && email === 'dev@tasken.app') {
      const user = await upsertUserByEmail(email);

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, user.id);

      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

      return { success: true, message: 'DEV MODE BYPASS' };
    }

    const token = generateMagicLinkToken();

    try {
      await storeMagicLink(email, token);
      await sendMagicLinkEmail(email, token);
    } catch (e) {
      console.error('Error during magic link process:', e);

      return fail(500, { error: 'An unexpected error occurred. Please try again later.' });
    }

    return { success: true, message: 'Magic link sent to ' + email };
  }
};
