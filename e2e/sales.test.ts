import { expect, test } from '@playwright/test';

test('sales page loads copy and buttons', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Your Tasks, at the Speed of')).toBeVisible();

  await expect(page.getByText('Start Focusing Now')).toBeVisible();

  const button = page.getByRole('link', { name: 'Start Focusing Now' });

  await button.click();

  await expect(page).toHaveURL('/auth/signup');

  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Continue with email')).toBeVisible();
});
