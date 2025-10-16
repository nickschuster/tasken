import type { TaskGroup } from '$lib/server/db/schema';

let taskGroups: TaskGroup[] = $state([]);

export function getTaskGroups() {
	return taskGroups;
}

export function setTaskGroups(newTaskGroups: TaskGroup[]) {
	taskGroups = [...newTaskGroups];
}

export function addTaskGroup(taskGroup: TaskGroup) {
	taskGroups.push(taskGroup);
}

export function updateTaskGroup(id: string, updatedTaskGroup: Partial<TaskGroup>) {
	const index = taskGroups.findIndex((t) => t.id === id);
	if (index !== -1) {
		taskGroups[index] = { ...taskGroups[index], ...updatedTaskGroup };
	}
}

export function deleteTaskGroup(id: string) {
	taskGroups = taskGroups.filter((t) => t.id !== id);
}
