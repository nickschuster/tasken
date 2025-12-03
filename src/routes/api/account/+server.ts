import { deleteUserAccountAndData } from '$lib/server/account';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function DELETE(event: RequestEvent) {
	if (!event.locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userId = event.locals.session.userId;

	try {
		await invalidateSession(event.locals.session.id);

		deleteSessionTokenCookie(event);

		await deleteUserAccountAndData(userId);

		return json({ good: 'bye!' });
	} catch (error) {
		console.error('Error deleting user account and data:', error);
		return json({ error: 'Failed to delete account' }, { status: 500 });
	}
}
