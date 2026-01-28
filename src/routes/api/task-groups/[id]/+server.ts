import { updateTaskGroup, deleteTaskGroup } from '$lib/server/taskGroups';
import { json } from '@sveltejs/kit';

export async function PATCH({ request, params }) {
  const taskGroupId = params.id;

  const taskGroupUpdate = await request.json();

  const updateResult = await updateTaskGroup(taskGroupId, taskGroupUpdate);

  return json(updateResult);
}

export async function DELETE({ params }) {
  const taskGroupId = params.id;

  const deletedTaskGroup = await deleteTaskGroup(taskGroupId);

  return json(deletedTaskGroup);
}
