import { addTask, updateTask, getTasks } from '$lib/states/task.state.svelte.js';
import { wsService } from '$lib/services/ws.service.js';
import { Event } from '$lib/models/event.js';
import type { Task } from '$lib/server/db/schema';
import { invalidate } from '$app/navigation';

export const createTaskFetch = async (content: string): Promise<boolean> => {
	try {
		const result = await fetch('/api/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		});

		if (result.ok) {
			const newTask = await result.json();

			addTask(newTask);

			wsService.sendMessage(Event.TaskAdded, newTask);
		}

		await invalidate('/home');

		return result.ok;
	} catch (e) {
		console.error('Error creating task:', e);

		return false;
	}
};

export const updateTaskFetch = async (taskId: string, updates: Partial<Task>): Promise<boolean> => {
	try {
		const currentTask = getTasks().find((task) => task.id === taskId);

		updateTask(taskId, updates);

		const result = await fetch(`/api/tasks/${taskId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updates)
		});

		if (!result.ok && currentTask) {
			updateTask(taskId, currentTask);
		} else {
			wsService.sendMessage(Event.TaskUpdated, { ...currentTask, ...updates });
		}

		await invalidate('/home');

		return result.ok;
	} catch (e) {
		console.error('Error updating task:', e);

		return false;
	}
};

export const getTasksFetch = async (
	limit: number
): Promise<{ tasks: Task[]; hasMoreTasks: boolean } | null> => {
	try {
		const result = await fetch(`/api/tasks?limit=${limit}`);

		if (result.ok) {
			const response = await result.json();

			// sync

			return { tasks: response.tasks, hasMoreTasks: response.hasMoreTasks };
		}

		return null;
	} catch (e) {
		console.error('Error fetching tasks:', e);

		return null;
	}
};
