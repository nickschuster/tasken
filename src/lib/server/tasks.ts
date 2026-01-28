import { and, eq, isNotNull, isNull, desc, count, sql } from 'drizzle-orm';
import { db } from './db';
import { task, type Task } from './db/schema';
import { UUIDV4 } from './helper';
import { midAfter, mid } from '$lib/services/ordering.service';

export const getCompletedTasks = async (userId: string, limit: number) => {
  const query = db
    .select()
    .from(task)
    .where(and(eq(task.userId, userId), isNotNull(task.completedAt)))
    .limit(limit)
    .orderBy(desc(task.completedAt));

  return query.execute();
};

export const getCompletedTasksCount = async (userId: string) => {
  const query = db
    .select({ count: count() })
    .from(task)
    .where(and(eq(task.userId, userId), isNotNull(task.completedAt)));

  const [result] = await query.execute();

  return result.count;
};

export const getUncompletedTasks = async (userId: string) => {
  const query = db
    .select()
    .from(task)
    .where(and(isNull(task.completedAt), eq(task.userId, userId)))
    .orderBy(desc(sql`${task.order} COLLATE "C"`));

  return query.execute();
};

export const getTaskById = async (taskId: string) => {
  const query = db.select().from(task).where(eq(task.id, taskId)).limit(1);

  const [taskResult] = await query.execute();

  return taskResult;
};

export const createTask = async (
  userId: string,
  taskToCreate: Pick<Task, 'content' | 'dueDate' | 'taskGroupId'>
) => {
  const [maxRow] = await db
    .select({ order: task.order })
    .from(task)
    .where(and(eq(task.userId, userId), isNotNull(task.order)))
    .orderBy(desc(sql`${task.order} COLLATE "C"`))
    .limit(1)
    .execute();

  const newOrder = maxRow?.order ? midAfter(maxRow.order) : mid('', null);

  const [createdTask] = await db
    .insert(task)
    .values({
      id: UUIDV4(),
      ...taskToCreate,
      userId,
      order: newOrder
    })
    .returning()
    .execute();

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
