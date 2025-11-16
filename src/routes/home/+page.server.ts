import { getTasks, getCompletedTasksCount } from '$lib/server/tasks';
import { getTaskGroups } from '$lib/server/taskGroups';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import { PaymentProcessor } from '$lib/server/payments';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.user) {
		return redirect(302, '/auth/signup');
	}

	const paymentProcessor = PaymentProcessor.getInstance();

	const sessionId = url.searchParams.get('sessionId');

	if (sessionId) {
		const success = await paymentProcessor.checkCheckoutStatus(sessionId);

		if (success) {
			locals.user = await paymentProcessor.grantPremium(locals.user.id);
		}
	}

	const subscriptionDetails = await paymentProcessor.getSubscriptionDetails(
		locals.user.premiumExpiresAt
	);

	const tasks = await getTasks(locals.user.id);

	const hasMoreTasks = tasks.length > 100;

	return {
		tasks: tasks.slice(0, 100),
		hasMoreTasks,
		completedTasksCount: await getCompletedTasksCount(locals.user.id),
		taskGroups: await getTaskGroups(locals.user.id),
		user: locals.user,
		subscriptionDetails
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
};
