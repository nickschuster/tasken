import { eq } from 'drizzle-orm';
import { db } from './db';
import { user as userTable, type User } from './db/schema';
import { UUIDV4 } from './helper';
import { DateTime } from 'luxon';

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

export async function grantPremium(userId: string) {
	return updateUser(userId, {
		premiumExpiresAt: DateTime.now().plus({ days: 45 }).toJSDate()
	});
}
