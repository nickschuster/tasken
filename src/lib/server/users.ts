import { eq } from 'drizzle-orm';
import { db } from './db';
import { user as userTable } from './db/schema';
import { UUIDV4 } from './helper';

export async function upsertUserByEmail(email: string) {
	let [user] = await db.select().from(userTable).where(eq(userTable.email, email));

	if (!user) {
		const userId = UUIDV4();

		[user] = await db.insert(userTable).values({ id: userId, email }).returning();
	}

	return user;
}
