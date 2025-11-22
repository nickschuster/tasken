import { parseDate } from '$lib/server/helper';
import { createTask } from '$lib/server/tasks';
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
