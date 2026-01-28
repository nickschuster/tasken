import {
	addTaskGroup,
	updateTaskGroup,
	deleteTaskGroup,
	getTaskGroups
} from '$lib/states/taskGroup.state.svelte.js';
import type { TaskGroup } from '$lib/server/db/schema';
import { invalidate } from '$app/navigation';
import { wsService } from './ws.service';
import { Event } from '$lib/models/event';

export const createTaskGroupFetch = async (): Promise<TaskGroup | null> => {
	try {
		const result = await fetch('/api/task-groups', {
			method: 'POST'
		});

		if (result.ok) {
			const newTaskGroup = await result.json();

			addTaskGroup(newTaskGroup);

			wsService.sendMessage(Event.TaskGroupAdded, newTaskGroup);

			return newTaskGroup;
		}

		await invalidate('/home');

		return null;
	} catch (e) {
		console.error('Error creating task group: ', e);

		return null;
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
			wsService.sendMessage(Event.TaskGroupUpdated, { ...currentTaskGroup, ...updates });
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

		if (result.ok) {
			wsService.sendMessage(Event.TaskGroupDeleted, taskGroupId);
		}

		await invalidate('/home');

		return result.ok;
	} catch (e) {
		console.error('Error deleting task group: ', e);

		return false;
	}
};
