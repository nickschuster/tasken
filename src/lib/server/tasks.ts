import { eq } from 'drizzle-orm';
import { db } from './db';
import { task, type Task } from './db/schema';
import { UUIDV4 } from './helper';

export const getUncompletedTasks = async () => {
	const query = db.select().from(task).where(eq(task.isCompleted, false));

	return query.execute();
};

export const createTask = async (taskToCreate: Pick<Task, 'content'>) => {
	const insert = db
		.insert(task)
		.values({ id: UUIDV4(), ...taskToCreate })
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
