import { eq } from 'drizzle-orm';
import { db } from './db';
import { session, task, taskGroup, user } from './db/schema';
import { PaymentProcessor } from './payments';

export const deleteUserAccountAndData = async (userId: string) => {
	const [currentUser] = await db.select().from(user).where(eq(user.id, userId)).execute();

	if (!currentUser) {
		throw new Error('User not found!');
	}

	const deleteSessions = db.delete(session).where(eq(session.userId, userId));

	const deleteTasks = db.delete(task).where(eq(task.userId, userId));

	const deleteTaskGroups = db.delete(taskGroup).where(eq(taskGroup.userId, userId));

	const deleteUser = db.delete(user).where(eq(user.id, userId));

	await deleteSessions.execute();
	await deleteTasks.execute();
	await deleteTaskGroups.execute();
	await deleteUser.execute();

	const paymentProcessor = PaymentProcessor.getInstance();
	await paymentProcessor.deleteCustomerAndCancelSubscriptions(currentUser.email);
};
