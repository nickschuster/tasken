import { updateTask } from '$lib/server/tasks';
import { json } from '@sveltejs/kit';

export async function PATCH({ request, params }) {
	const taskId = params.id;

	const taskUpdate = await request.json();

	const validUpdates = {
		isCompleted: taskUpdate.isCompleted,
		content: taskUpdate.content
	};

	const updateResult = await updateTask(taskId, validUpdates);

	return json(updateResult);
}
