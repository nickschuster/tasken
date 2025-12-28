import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	webServer: {
		command: process.env.CI ? 'npm run build && npm run preview' : 'npm run dev',
		port: process.env.CI ? 4173 : 5173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'e2e',
	projects: [
		{
			name: 'setup',
			testMatch: /auth\.setup\.ts/
		},
		{
			name: 'cleanup auth',
			testMatch: /auth\.teardown\.ts/,
			use: {
				storageState: 'e2e/.auth/user.json'
			}
		},
		{
			name: 'public',
			testDir: 'e2e/public'
		},
		{
			name: 'authenticated',
			testDir: 'e2e/auth',
			dependencies: ['setup'],
			use: {
				storageState: 'e2e/.auth/user.json'
			},
			teardown: 'cleanup auth'
		}
	]
});
