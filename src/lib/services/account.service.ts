import { wsService } from './ws.service';

export const accountDelete = async () => {
	try {
		const response = await fetch(`/api/account`, {
			method: 'DELETE'
		});

		if (response.ok) {
			wsService.setShouldReconnect(false);
			window.location.href = '/';
		}
	} catch (e) {
		console.error('Error deleting account', e);
	}
};
