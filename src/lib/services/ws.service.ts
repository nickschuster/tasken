import { browser } from '$app/environment';
import { eventEmitter } from './event-emitter.service';
import { Event, type Function } from '$lib/models/event';
import { PUBLIC_WS_URL } from '$env/static/public';

class WebSocketService {
	private static instance: WebSocketService;
	private socket: WebSocket | null = null;
	private emitter = eventEmitter;

	private readonly reconnectDelay = 1000;
	private readonly heartbeatDelay = 10000;
	private shouldReconnect = true;
	private heartbeatInterval: NodeJS.Timeout | null = null;
	private reconnectInterval: NodeJS.Timeout | null = null;

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

			this.socket.onopen = () => {
				if (this.reconnectInterval) {
					clearInterval(this.reconnectInterval);
					this.reconnectInterval = null;
				}

				this.startHeartbeat();
			};

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

			this.socket.onclose = () => {
				console.warn('Websocket closed');
				this.stopHeartbeat();

				if (this.shouldReconnect) {
					this.scheduleReconnect();
				}
			};

			this.socket.onerror = (e) => {
				console.error('Websocket error: ', e);
				this.socket?.close();
			};
		} catch (error) {
			console.error('WebSocket connection error:', error);
		}
	}

	private startHeartbeat() {
		this.stopHeartbeat();
		this.heartbeatInterval = setInterval(() => {
			this.sendMessage(Event.Ping, {});
		}, this.heartbeatDelay);
	}

	private stopHeartbeat() {
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
	}

	private scheduleReconnect() {
		if (this.reconnectInterval) return;

		this.reconnectInterval = setInterval(() => {
			console.log('Attempting to reconnect...');
			this.connect();
		}, this.reconnectDelay);
	}

	public setShouldReconnect(shouldReconnect: boolean) {
		this.shouldReconnect = shouldReconnect;
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
