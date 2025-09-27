import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const task = pgTable('task', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => user.id),
	content: text('content'),
	isCompleted: boolean('is_completed').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Task = typeof task.$inferSelect;
