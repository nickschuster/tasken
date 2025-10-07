import { type Function } from '$lib/models/event';

class EventEmitter {
	private static instance: EventEmitter;
	private listeners: Map<string, Function[]> = new Map();

	private constructor() {}

	public static getInstance(): EventEmitter {
		if (!EventEmitter.instance) {
			EventEmitter.instance = new EventEmitter();
		}
		return EventEmitter.instance;
	}

	public listen(event: string, callback: Function) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}

		try {
			this.listeners.get(event)!.push(callback);
		} catch (error) {
			console.error('Error adding event listener for:', event, error);
		}
	}

	public forget(event: string, callback: Function) {
		if (this.listeners.has(event)) {
			try {
				const eventListeners = this.listeners.get(event)!.filter((cb) => cb !== callback);
				this.listeners.set(event, eventListeners);
			} catch (error) {
				console.error('Error removing event listener for:', event, error);
			}
		}
	}

	public emit(event: string, payload: unknown) {
		if (this.listeners.has(event)) {
			try {
				this.listeners.get(event)!.forEach((callback) => callback(payload));
			} catch (error) {
				console.error('Error emitting event for:', event, error);
			}
		}
	}
}

export const eventEmitter = EventEmitter.getInstance();
