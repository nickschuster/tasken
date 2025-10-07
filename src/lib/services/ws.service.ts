import { browser } from '$app/environment';
import { eventEmitter } from './event-emitter.service';
import { Event, type Function } from '$lib/models/event';
import { PUBLIC_WS_URL } from '$env/static/public';

class WebSocketService {
	private static instance: WebSocketService;
	private socket: WebSocket | null = null;
	private emitter = eventEmitter;

	private constructor() {}

	public static getInstance(): WebSocketService {
		if (!WebSocketService.instance) {
			WebSocketService.instance = new WebSocketService();
		}
		return WebSocketService.instance;
	}

	public connect(): void {
		if (!browser || (this.socket && this.socket.readyState < 2)) {
			return;
		}

		try {
			this.socket = new WebSocket(PUBLIC_WS_URL);

			this.socket.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data);

					if (message.event && message.payload !== undefined) {
						this.emitter.emit(message.event, message.payload);
					}
				} catch (e) {
					console.error('WebSocket message parse error:', e);
				}
			};
		} catch (error) {
			console.error('WebSocket connection error:', error);
		}
	}

	public on(event: string, callback: Function) {
		this.emitter.listen(event, callback);
	}

	public off(event: string, callback: Function) {
		this.emitter.forget(event, callback);
	}

	public sendMessage(event: Event, payload: unknown): void {
		try {
			if (this.socket && this.socket.readyState === WebSocket.OPEN) {
				this.socket.send(JSON.stringify({ event, payload }));
			}
		} catch (error) {
			console.error('WebSocket send message error:', error);
		}
	}
}

export const wsService = WebSocketService.getInstance();
