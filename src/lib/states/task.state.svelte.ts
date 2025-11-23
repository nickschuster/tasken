import { wsService } from '$lib/services/ws.service';
import type { Task } from '$lib/server/db/schema';
import { Event } from '$lib/models/event';
import { decrementCompletedCount, incrementCompletedCount } from './completedCount.state.svelte';

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
}

wsService.on(Event.TaskAdded, (newTask: Task) => {
	if (!tasks.find((t) => t.id === newTask.id)) {
		tasks.push(newTask);
	}
});

wsService.on(Event.TaskUpdated, (updatedTask: Task) => {
	const index = tasks.findIndex((t) => t.id === updatedTask.id);
	const existingTask = index !== -1 ? tasks[index] : null;

	const wasCompleted = !!existingTask?.completedAt;
	const isCompleted = !!updatedTask.completedAt;

	if (wasCompleted !== isCompleted) {
		if (isCompleted) incrementCompletedCount();
		else decrementCompletedCount();
	}

	if (existingTask) {
		tasks[index] = { ...existingTask, ...updatedTask };
	} else {
		tasks.push(updatedTask);
		decrementCompletedCount();
	}
});
