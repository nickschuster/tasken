import { createTask } from '$lib/server/tasks';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const taskToCreate = await request.json();

  const createdTask = await createTask(taskToCreate);

  return json(createdTask);
}