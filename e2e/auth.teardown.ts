import { test as teardown, expect } from '@playwright/test';
import { AUTH_FINISHED } from './utils';

if (!AUTH_FINISHED) {
  teardown.skip();
}

teardown('delete test account', async ({ page }) => {
  await page.goto('/home');

  const loginButton = await page.getByText('Continue with email').isVisible();

  if (loginButton) {
    await page.getByPlaceholder('Email').fill('dev@tasken.app');

    await page.getByRole('button', { name: 'Continue with email' }).click();
  }

  await expect(page).toHaveURL('/home');

  await page.getByRole('button', { name: 'D', exact: true }).click();

  await page.getByText('Delete Account').click();

  await page.getByRole('checkbox', { name: 'I understand that this action' }).click();

  await page.getByRole('button', { name: 'Delete Account' }).click();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL('/');
});
