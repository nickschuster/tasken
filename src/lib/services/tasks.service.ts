import { addTask, updateTask, getTasks } from '$lib/states/task.state.svelte.js';
import { wsService } from '$lib/services/ws.service.js';
import { Event } from '$lib/models/event.js';
import type { Task } from '$lib/server/db/schema';
import { invalidate } from '$app/navigation';

export const createTaskFetch = async (task: Partial<Task>): Promise<boolean> => {
	try {
		const result = await fetch('/api/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(task)
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

export const orderTaskFetch = async (
	taskId: string,
	leftId: string | null,
	rightId: string | null
) => {
	try {
		const result = await fetch(`/api/tasks/${taskId}/move`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ leftId, rightId })
		});

		if (result.ok) {
			const updatedTask = await result.json();

			updateTask(taskId, { order: updatedTask.order });

			wsService.sendMessage(Event.TaskUpdated, updatedTask);
		}

		await invalidate('/home');

		return result.ok;
	} catch (e) {
		console.error('Error ordering task:', e);

		return false;
	}
};

export const getTasksFetch = async (
	limit: number
): Promise<{ tasks: Task[]; hasMoreCompletedTasks: boolean } | null> => {
	try {
		const result = await fetch(`/api/tasks?limit=${limit}`);

		if (result.ok) {
			const response = await result.json();

			return { tasks: response.tasks, hasMoreCompletedTasks: response.hasMoreCompletedTasks };
		}

		return null;
	} catch (e) {
		console.error('Error fetching tasks:', e);

		return null;
	}
};
