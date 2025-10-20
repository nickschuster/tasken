export const enum Event {
	TaskAdded = 'task:added',
	TaskUpdated = 'task:updated',
	TaskGroupAdded = 'taskgroup:added',
	TaskGroupUpdated = 'taskgroup:updated',
	TaskGroupDeleted = 'taskgroup:deleted'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Function = (...args: any[]) => any;
