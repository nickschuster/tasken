import { getTaskById, updateTask } from '$lib/server/tasks.js';
import { midBefore, midAfter, mid } from '$lib/services/ordering.service.js';
import { json } from '@sveltejs/kit';

export async function POST({ params, request }) {
	const taskId = params.id;
	const body = await request.json();
	const leftId: string | null = body.leftId ?? null;
	const rightId: string | null = body.rightId ?? null;

	const leftTask = leftId ? await getTaskById(leftId) : null;
	const rightTask = rightId ? await getTaskById(rightId) : null;

	if (!leftTask && !rightTask) {
		return json({ error: 'At least one neighbor must be provided' }, { status: 400 });
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
			const a = leftOrder! < rightOrder! ? leftOrder! : rightOrder!;
			const b = leftOrder! < rightOrder! ? rightOrder! : leftOrder!;

			newOrder = mid(a, b);
		}

		const updatedResult = await updateTask(taskId, { order: newOrder });

		return json(updatedResult, { status: 200 });
	} catch (err) {
		console.error('Error moving task:', err);

		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
