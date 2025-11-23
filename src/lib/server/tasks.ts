import { and, eq, isNotNull, isNull, desc, count } from 'drizzle-orm';
import { db } from './db';
import { task, type Task } from './db/schema';
import { UUIDV4 } from './helper';

export const getCompletedTasks = async (userId: string, limit: number) => {
	const query = db
		.select()
		.from(task)
		.where(and(eq(task.userId, userId), isNotNull(task.completedAt)))
		.limit(limit + 1)
		.orderBy(desc(task.completedAt));

	return query.execute();
};

export const getCompletedTasksCount = async (userId: string) => {
	const query = db
		.select({ count: count() })
		.from(task)
		.where(and(eq(task.userId, userId), isNotNull(task.completedAt)));

	return query.execute();
};

export const getUncompletedTasks = async (userId: string) => {
	const query = db
		.select()
		.from(task)
		.where(and(isNull(task.completedAt), eq(task.userId, userId)))
		.orderBy(desc(task.createdAt));

	return query.execute();
};

export const createTask = async (
	userId: string,
	taskToCreate: Pick<Task, 'content' | 'dueDate' | 'taskGroupId'>
) => {
	const insert = db
		.insert(task)
		.values({ id: UUIDV4(), ...taskToCreate, userId })
		.returning();

	const [createdTask] = await insert.execute();

	return createdTask;
};

export const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
	const update = db
		.update(task)
		.set({ ...updatedTask })
		.where(eq(task.id, taskId))
		.returning();

	const [updateResult] = await update.execute();

	return updateResult;
};
