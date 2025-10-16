import { getUncompletedTasks } from '$lib/server/tasks';
import { getTaskGroups } from '$lib/server/taskGroups';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/auth/signup');
	}

	return {
		tasks: await getUncompletedTasks(locals.user.id),
		taskGroups: await getTaskGroups(locals.user.id),
		user: locals.user
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
