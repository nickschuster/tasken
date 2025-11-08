import { updateTask } from '$lib/server/tasks';
import { json } from '@sveltejs/kit';

export async function PATCH({ request, params, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const taskId = params.id;

	const taskUpdate = await request.json();

	const parseDate = (key: string) => {
		return taskUpdate[key] !== undefined
			? { [key]: taskUpdate[key] ? new Date(taskUpdate[key]) : null }
			: {};
	};

	const validUpdates = {
		...taskUpdate,
		...parseDate('completedAt'),
		...parseDate('dueDate')
	};

	const updateResult = await updateTask(taskId, validUpdates);

	return json(updateResult);
}
