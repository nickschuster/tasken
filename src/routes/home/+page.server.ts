import { getTasks } from '$lib/server/tasks';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		tasks: await getTasks()
	};
};
