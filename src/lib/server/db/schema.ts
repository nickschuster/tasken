import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	premiumExpiresAt: timestamp('premium_expires_at', { withTimezone: true, mode: 'date' })
	// add oauth_id column later or separate identity table, or identity_id and identity_provider
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
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	content: text('content'),
	isImportant: boolean('is_important').notNull().default(false),
	taskGroupId: text('task_group_id').references(() => taskGroup.id, { onDelete: 'set null' }),
	order: text('order'),
	dueDate: timestamp('due_date', { withTimezone: true, mode: 'date' }),
	completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const taskGroup = pgTable('task_group', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	color: text('color'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	email: text('email').notNull(),
	type: text('type').notNull(),
	status: text('status').notNull(),
	tokenHash: text('token_hash').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	usedAt: timestamp('used_at', { withTimezone: true, mode: 'date' })
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Task = typeof task.$inferSelect;

export type Verification = typeof verification.$inferSelect;

export type TaskGroup = typeof taskGroup.$inferSelect;
