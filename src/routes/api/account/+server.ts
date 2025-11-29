import { deleteUserAccountAndData } from '$lib/server/account';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';
import { json } from '@sveltejs/kit';

export async function DELETE(event) {
	if (!event.locals.session) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const userId = event.locals.session.userId;

	await invalidateSession(event.locals.session.id);

	deleteSessionTokenCookie(event);

	await deleteUserAccountAndData(userId);

	return json({ good: 'bye!' });
}
