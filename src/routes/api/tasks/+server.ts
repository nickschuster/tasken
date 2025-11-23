import {
	createTask,
	getCompletedTasks,
	getCompletedTasksCount,
	getUncompletedTasks
} from '$lib/server/tasks';
import { parseDate } from '$lib/server/helper';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const taskToCreate = await request.json();

	const validTaskToCreate = {
		...taskToCreate,
		...parseDate(taskToCreate, 'dueDate')
	};

	const createdTask = await createTask(locals.user.id, validTaskToCreate);

	return json(createdTask);
}

export async function GET({ locals, url }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const limit = Number(url.searchParams.get('limit'));

	if (isNaN(limit) || limit <= 0) {
		return json({ error: 'Invalid limit parameter' }, { status: 400 });
	}

	const tasks = await getUncompletedTasks(locals.user.id);
	const completedTasks = await getCompletedTasks(locals.user.id, limit);
	const completedTasksCount = await getCompletedTasksCount(locals.user.id);

	const hasMoreCompletedTasks = completedTasksCount > limit;

	return json({ tasks: tasks.concat(completedTasks), hasMoreCompletedTasks });
}
