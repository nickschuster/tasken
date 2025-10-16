import {
	addTaskGroup,
	updateTaskGroup,
	deleteTaskGroup,
	getTaskGroups
} from '$lib/states/taskGroup.state.svelte.js';
import type { TaskGroup } from '$lib/server/db/schema';
import { invalidate } from '$app/navigation';

export const createTaskGroupFetch = async (): Promise<boolean> => {
	try {
		const result = await fetch('/api/task-groups', {
			method: 'POST'
		});

		if (result.ok) {
			const newTaskGroup = await result.json();

			addTaskGroup(newTaskGroup);

			// sync
		}

		await invalidate('/home');

		return result.ok;
	} catch (e) {
		console.error('Error creating task group: ', e);

		return false;
	}
};

export const updateTaskGroupFetch = async (
	taskGroupId: string,
	updates: Partial<TaskGroup>
): Promise<boolean> => {
	try {
		const currentTaskGroup = getTaskGroups().find((taskGroup) => taskGroup.id === taskGroupId);

		updateTaskGroup(taskGroupId, updates);

		const result = await fetch(`/api/task-groups/${taskGroupId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updates)
		});

		if (!result.ok && currentTaskGroup) {
			updateTaskGroup(taskGroupId, currentTaskGroup);
		} else {
			// sync
		}

		await invalidate('/home');

		return result.ok;
	} catch (e) {
		console.error('Error updating task group: ', e);

		return false;
	}
};

export const deleteTaskGroupFetch = async (taskGroupId: string): Promise<boolean> => {
	try {
		deleteTaskGroup(taskGroupId);

		const result = await fetch(`/api/task-groups/${taskGroupId}`, {
			method: 'DELETE'
		});

		if (!result.ok) {
			await invalidate('/home');
		}

		return result.ok;
	} catch (e) {
		console.error('Error deleting task group: ', e);

		return false;
	}
};
