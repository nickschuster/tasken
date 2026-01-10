import { test as setup, expect } from '@playwright/test';
import { markAuthFinished } from './utils';

setup('authenticate', async ({ page, context }) => {
	await page.goto('/auth/signup');
	await page.getByPlaceholder('Email').fill('dev@tasken.app');

	await page.getByRole('button', { name: 'Continue with email' }).click();

	await expect(page).toHaveURL(/home/);

	const stripeButton = await page.getByText('Choose Your Plan').isVisible();

	if (stripeButton) {
		await expect(page.getByText('Choose Your Plan')).toBeVisible();

		await page.getByRole('button', { name: 'Choose Basic' }).click();

		await expect(page).toHaveURL(/checkout.stripe.com/);

		await page.getByRole('textbox', { name: 'Card number' }).fill('4242424242424242');
		await page.getByRole('textbox', { name: 'Expiration' }).fill('1230');
		await page.getByRole('textbox', { name: 'CVC' }).fill('123');
		await page.getByRole('textbox', { name: 'Cardholder name' }).fill('Test');
		await page.getByRole('button', { name: 'Subscribe' }).click();

		// stripe redirect can take a while
		await page.waitForLoadState('networkidle', { timeout: 20000 });

		await expect(page).toHaveURL(/home/, { timeout: 20000 });
	}

	await context.storageState({ path: 'e2e/.auth/user.json' });

	markAuthFinished();
});
