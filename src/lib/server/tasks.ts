import { and, eq, isNotNull, desc, count } from 'drizzle-orm';
import { db } from './db';
import { task, type Task } from './db/schema';
import { UUIDV4 } from './helper';

export const getCompletedTasksCount = async (userId: string) => {
	const query = db
		.select({ count: count() })
		.from(task)
		.where(and(eq(task.userId, userId), isNotNull(task.completedAt)));

	return query.execute();
};

export const getTasks = async (userId: string, limit: number = 100) => {
	const query = db
		.select()
		.from(task)
		.where(eq(task.userId, userId))
		.orderBy(desc(task.completedAt), desc(task.createdAt))
		.limit(limit + 1);

	return query.execute();
};

export const createTask = async (userId: string, taskToCreate: Pick<Task, 'content'>) => {
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
