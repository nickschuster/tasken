import { getTaskById, updateTask } from '$lib/server/tasks.js';
import { midBefore, midAfter, mid } from '$lib/services/ordering.service.js';
import { json } from '@sveltejs/kit';

export async function POST({ params, request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const taskId = params.id;
	const body = await request.json();
	const leftId: string | null = body.leftId ?? null;
	const rightId: string | null = body.rightId ?? null;

	const taskToMove = await getTaskById(taskId);
	if (!taskToMove || taskToMove.userId !== locals.user.id) {
		return json({ error: 'Task not found' }, { status: 404 });
	}

	const leftTask = leftId ? await getTaskById(leftId) : null;
	const rightTask = rightId ? await getTaskById(rightId) : null;

	if (!leftTask && !rightTask) {
		return json({ error: 'At least one valid neighbor task must exist' }, { status: 400 });
	}

	try {
		const leftOrder = leftTask?.order ?? null;
		const rightOrder = rightTask?.order ?? null;

		let newOrder: string;
		if (!leftTask && rightOrder !== null) {
			newOrder = midAfter(rightOrder);
		} else if (!rightTask && leftOrder !== null) {
			newOrder = midBefore(leftOrder);
		} else {
			newOrder = mid(rightOrder!, leftOrder!);
		}

		const updatedResult = await updateTask(taskId, { order: newOrder });

		return json(updatedResult, { status: 200 });
	} catch (err) {
		console.error('Error moving task:', err);

		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
