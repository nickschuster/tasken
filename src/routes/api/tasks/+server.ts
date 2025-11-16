import { createTask, getTasks } from '$lib/server/tasks';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const taskToCreate = await request.json();

	const createdTask = await createTask(locals.user.id, taskToCreate);

	return json(createdTask);
}

export async function GET({ locals, url }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const limit = Number(url.searchParams.get('limit'));

	if (isNaN(limit) || limit < 0) {
		return json({ error: 'Invalid limit parameter' }, { status: 400 });
	}

	const tasks = await getTasks(locals.user.id, limit);

	const hasMoreTasks = tasks.length > limit;

	return json({ tasks: tasks.slice(0, limit), hasMoreTasks });
}
