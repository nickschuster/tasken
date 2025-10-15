import { getUncompletedTasks } from '$lib/server/tasks';
import {
	createTaskGroup,
	getTaskGroups,
	updateTaskGroup,
	deleteTaskGroup
} from '$lib/server/taskGroups';
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
	},
	createTaskGroup: async ({ locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		try {
			await createTaskGroup(locals.user.id);
		} catch (e) {
			console.error('Error during task group creation:', e);

			return fail(500, { error: 'An unexpected error occurred. Please try again later.' });
		}
	},
	renameTaskGroup: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const formData = await request.formData();
		const taskGroupId = formData.get('groupId');
		const newGroupName = formData.get('groupName');

		if (typeof taskGroupId !== 'string' || taskGroupId.length == 0) {
			return fail(400, { error: 'Task group id is required' });
		}

		if (typeof newGroupName !== 'string' || newGroupName.length === 0) {
			return fail(400, { error: 'Task group name is required' });
		}

		const updatedValues = {
			name: newGroupName
		};

		try {
			await updateTaskGroup(taskGroupId, updatedValues);
		} catch (e) {
			console.error('Error during task group renaming:', e);

			return fail(500, { error: 'An unexpected error occurred. Please try again later.' });
		}
	},
	deleteTaskGroup: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const formData = await request.formData();
		const groupId = formData.get('groupId');

		if (typeof groupId !== 'string' || groupId.length === 0) {
			return fail(400, { error: 'Task group id is required' });
		}

		try {
			await deleteTaskGroup(groupId);
		} catch (e) {
			console.error('Error during task group deletion:', e);

			return fail(500, { error: 'An unexpected error occurred. Please try again later.' });
		}
	}
};
