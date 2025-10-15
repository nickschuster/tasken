import { eq } from 'drizzle-orm';
import { db } from './db';
import { user, type User } from './db/schema';

export const updateUser = async (userId: string, updates: Partial<User>) => {
	const update = db
		.update(user)
		.set({ ...updates })
		.where(eq(user.id, userId))
		.returning();

	const [updateResult] = await update.execute();

	return updateResult;
};
