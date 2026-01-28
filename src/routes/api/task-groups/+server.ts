import { createTaskGroup } from '$lib/server/taskGroups';
import { json } from '@sveltejs/kit';

export async function POST({ locals }) {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const createdTaskGroup = await createTaskGroup(locals.user.id);

  return json(createdTaskGroup, { status: 201 });
}
