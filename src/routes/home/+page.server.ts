import { getUncompletedTasks } from '$lib/server/tasks';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import { getRequestEvent } from '$app/server';

export const load: PageServerLoad = async () => {
	return {
		tasks: await getUncompletedTasks(),
		user: requireLogin()
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/auth/signup');
	}

	return locals.user;
}
