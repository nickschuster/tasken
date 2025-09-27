import { db } from './db';
import { task, type Task } from './db/schema';
import { UUIDV4 } from './helper';

export const getTasks = async () => {
	const query = db.select().from(task);

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
