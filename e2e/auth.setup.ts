import { test as setup, expect } from '@playwright/test';
import { markAuthFinished } from './utils';

setup('authenticate', async ({ page, context }) => {
  await page.goto('/auth/signup');
  await page.getByPlaceholder('Email').fill('dev@tasken.app');

  await page.getByRole('button', { name: 'Continue with email' }).click();

  await expect(page).toHaveURL(/home/);

  await context.storageState({ path: 'e2e/.auth/user.json' });

  markAuthFinished();
});
