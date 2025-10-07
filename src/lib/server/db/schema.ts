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

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	email: text('email').notNull(),
	type: text('type').notNull(),
	status: text('status').notNull(),
	token_hash: text('token_hash').notNull().unique(),
	created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	expires_at: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	used_at: timestamp('used_at', { withTimezone: true, mode: 'date' })
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Task = typeof task.$inferSelect;

export type Verification = typeof verification.$inferSelect;
