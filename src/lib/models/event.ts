export const enum Event {
	Ping = 'socket:ping',
	TaskAdded = 'task:added',
	TaskUpdated = 'task:updated'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Function = (...args: any[]) => any;
