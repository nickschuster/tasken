import { eq } from 'drizzle-orm';
import { db } from './db';
import { user as userTable, type User } from './db/schema';
import { UUIDV4 } from './helper';

export const updateUser = async (userId: string, updates: Partial<User>) => {
	const update = db
		.update(userTable)
		.set({ ...updates })
		.where(eq(userTable.id, userId))
		.returning();

	const [updateResult] = await update.execute();

	return updateResult;
};

export async function upsertUserByEmailOnLogin(email: string) {
	let [user] = await db.select().from(userTable).where(eq(userTable.email, email));

	if (!user) {
		const userId = UUIDV4();

		[user] = await db.insert(userTable).values({ id: userId, email }).returning();
	}

	return user;
}
