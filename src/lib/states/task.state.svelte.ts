import { wsService } from '$lib/services/ws.service';
import type { Task } from '$lib/server/db/schema';
import { Event } from '$lib/models/event';
import { decrementCompletedCount, incrementCompletedCount } from './completedCount.state.svelte';
import { SvelteDate } from 'svelte/reactivity';

let tasks: Task[] = $state([]);

export function getTasks() {
	return tasks;
}

export function setTasks(newTasks: Task[]) {
	tasks = [...newTasks];
}

export function addTask(task: Task) {
	tasks.unshift(task);
}

export function updateTask(id: string, updatedTask: Partial<Task>) {
	const index = tasks.findIndex((t) => t.id === id);
	if (index !== -1) {
		tasks[index] = { ...tasks[index], ...updatedTask };
	}

	if (updatedTask.completedAt !== undefined) {
		orderTasks();
	}
}

export function moveTask(taskId: string, newIndex: number) {
	const index = tasks.findIndex((t) => t.id === taskId);

	if (index !== -1) {
		const task = tasks[index];
		tasks.splice(index, 1);
		tasks.splice(newIndex, 0, task);
	}
}

export function orderTasks() {
	tasks.sort((a, b) => {
		if (a.completedAt && !b.completedAt) return 1;
		if (!a.completedAt && b.completedAt) return -1;

		if (!a.completedAt && !b.completedAt) {
			const aOrder = a.order ?? '';
			const bOrder = b.order ?? '';

			return aOrder > bOrder ? -1 : aOrder < bOrder ? 1 : 0;
		}

		return new SvelteDate(b.completedAt!).getTime() - new SvelteDate(a.completedAt!).getTime();
	});
}

wsService.on(Event.TaskAdded, (newTask: Task) => {
	if (!tasks.find((t) => t.id === newTask.id)) {
		tasks.unshift(newTask);
	}
});

wsService.on(Event.TaskUpdated, (updatedTask: Task) => {
	const index = tasks.findIndex((t) => t.id === updatedTask.id);
	const existingTask = index !== -1 ? tasks[index] : null;

	const wasCompleted = !!existingTask?.completedAt;
	const isCompleted = !!updatedTask.completedAt;
	const completedChanged = wasCompleted !== isCompleted;
	const orderChanged = existingTask?.order !== updatedTask.order;

	if (existingTask) {
		tasks[index] = { ...existingTask, ...updatedTask };
	} else {
		tasks.push(updatedTask);
		decrementCompletedCount();
	}

	if (completedChanged) {
		if (isCompleted) incrementCompletedCount();
		else decrementCompletedCount();
	}

	if (orderChanged || completedChanged) {
		orderTasks();
	}
});
