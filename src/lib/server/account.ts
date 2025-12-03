import { eq } from 'drizzle-orm';
import { db } from './db';
import { session, task, taskGroup, user } from './db/schema';
import { PaymentProcessor } from './payments';

export const deleteUserAccountAndData = async (userId: string) => {
	const [currentUser] = await db.select().from(user).where(eq(user.id, userId)).execute();

	if (!currentUser) {
		throw new Error('User not found');
	}

	const paymentProcessor = PaymentProcessor.getInstance();
	await paymentProcessor.deleteCustomerAndCancelSubscriptions(currentUser.email);

	await db.transaction(async (tx) => {
		const deleteSessions = tx.delete(session).where(eq(session.userId, userId));

		const deleteTasks = tx.delete(task).where(eq(task.userId, userId));

		const deleteTaskGroups = tx.delete(taskGroup).where(eq(taskGroup.userId, userId));

		const deleteUser = tx.delete(user).where(eq(user.id, userId));

		await deleteSessions.execute();
		await deleteTasks.execute();
		await deleteTaskGroups.execute();
		await deleteUser.execute();
	});
};
