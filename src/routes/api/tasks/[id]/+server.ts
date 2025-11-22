import { parseDate } from '$lib/server/helper';
import { updateTask } from '$lib/server/tasks';
import { json } from '@sveltejs/kit';

export async function PATCH({ request, params, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const taskId = params.id;

	const taskUpdate = await request.json();

	const validUpdates = {
		...taskUpdate,
		...parseDate(taskUpdate, 'completedAt'),
		...parseDate(taskUpdate, 'dueDate')
	};

	const updateResult = await updateTask(taskId, validUpdates);

	return json(updateResult);
}
