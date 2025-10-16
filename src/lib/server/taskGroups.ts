import { db } from './db';
import { taskGroup, type TaskGroup } from './db/schema';
import { eq } from 'drizzle-orm';
import { UUIDV4 } from './helper';

export const getTaskGroups = async (userId: string) => {
	const query = db
		.select()
		.from(taskGroup)
		.where(eq(taskGroup.userId, userId))
		.orderBy(taskGroup.createdAt);

	return query.execute();
};

export const createTaskGroup = async (userId: string) => {
	const taskGroupName = 'New Group';

	const insert = db
		.insert(taskGroup)
		.values({ id: UUIDV4(), name: taskGroupName, userId })
		.returning();

	const [createdTaskGroup] = await insert.execute();

	return createdTaskGroup;
};

export const updateTaskGroup = async (groupId: string, updatedTaskGroup: Partial<TaskGroup>) => {
	const update = db
		.update(taskGroup)
		.set({ ...updatedTaskGroup })
		.where(eq(taskGroup.id, groupId))
		.returning();

	const [updateResult] = await update.execute();

	return updateResult;
};

export const deleteTaskGroup = async (groupId: string) => {
	const deletion = db.delete(taskGroup).where(eq(taskGroup.id, groupId)).returning();

	const [deletedTaskGroup] = await deletion.execute();

	return deletedTaskGroup;
};
