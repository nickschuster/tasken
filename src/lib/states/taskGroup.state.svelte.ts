import type { TaskGroup } from '$lib/server/db/schema';
import { wsService } from '$lib/services/ws.service';
import { Event } from '$lib/models/event';

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

wsService.on(Event.TaskGroupAdded, (newTaskGroup: TaskGroup) => {
	if (!taskGroups.find((g) => g.id === newTaskGroup.id)) {
		taskGroups.push(newTaskGroup);
	}
});

wsService.on(Event.TaskGroupUpdated, (updatedTaskGroup: TaskGroup) => {
	const index = taskGroups.findIndex((g) => g.id === updatedTaskGroup.id);

	if (index !== -1) {
		taskGroups[index] = { ...taskGroups[index], ...updatedTaskGroup };
	}
});

wsService.on(Event.TaskGroupDeleted, (deletedTaskGroupId: string) => {
	if (taskGroups.find((g) => g.id === deletedTaskGroupId)) {
		taskGroups = taskGroups.filter((g) => g.id !== deletedTaskGroupId);
	}
});
