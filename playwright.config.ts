import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
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
