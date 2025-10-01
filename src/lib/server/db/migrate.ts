import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting migrations...', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const migrationClient = postgres(process.env.DATABASE_URL, {
	max: 1
});

async function runMigrations() {
	const db = drizzle(migrationClient);

	console.log('Running migrations...');

	await migrate(db, {
		migrationsFolder: './src/lib/server/db/migrations'
	});

	console.log('Migrations complete!');

	await migrationClient.end();
}

runMigrations().catch((err) => {
	console.error('Migration failed!', err);
	process.exit(1);
});
