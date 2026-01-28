import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('tasks can be completed and uncompleted', async ({ page }) => {
  await page.goto('/home');

  await expect(page).toHaveURL('/home');

  await expect(page.getByText('Tasks')).toHaveCount(1);

  const input = page.getByRole('textbox');

  await input.fill('First');
  await input.press('Enter');

  await input.fill('Second');
  await input.press('Enter');

  await expect(page.getByText('First')).toBeVisible();
  await expect(page.getByText('Second')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Task' })).toHaveCount(2);

  const firstTask = page.getByRole('button', { name: 'First' });
  const firstCheckbox = firstTask.getByRole('checkbox');

  await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes('/tasks') && res.request().method() === 'PATCH' && res.status() === 200
    ),
    firstCheckbox.click()
  ]);

  await page.reload();

  await expect(firstTask).toBeHidden();

  await expect(page.getByRole('button', { name: 'Task' })).toHaveCount(1);

  await page.locator('#taskList').getByRole('button').nth(2).click();

  await expect(firstTask).toBeVisible();

  await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes('/tasks') && res.request().method() === 'PATCH' && res.status() === 200
    ),
    firstCheckbox.click()
  ]);

  await page.reload();

  await expect(page.getByRole('button', { name: 'Task' })).toHaveCount(2);

  const secondTask = page.getByRole('button', { name: 'Second' });
  const secondCheckbox = secondTask.getByRole('checkbox');

  await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes('/tasks') && res.request().method() === 'PATCH' && res.status() === 200
    ),
    firstCheckbox.click()
  ]);

  await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes('/tasks') && res.request().method() === 'PATCH' && res.status() === 200
    ),
    secondCheckbox.click()
  ]);

  await page.reload();

  await expect(page.getByRole('button', { name: 'Task' })).toHaveCount(0);
});

test('tasks have a persistent ordering', async ({ page }) => {
  await page.goto('/home');

  await expect(page).toHaveURL('/home');

  await expect(page.getByText('Tasks')).toHaveCount(1);

  const input = page.getByRole('textbox');

  await input.fill('Task A');
  await input.press('Enter');
  await expect(page.getByText('Tasks')).toHaveCount(2);

  await input.fill('Task B');
  await input.press('Enter');
  await expect(page.getByText('Tasks')).toHaveCount(3);

  await input.fill('Task C');
  await input.press('Enter');
  await expect(page.getByText('Tasks')).toHaveCount(4);

  await expect(page.getByText('Task A')).toBeVisible();
  await expect(page.getByText('Task B')).toBeVisible();
  await expect(page.getByText('Task C')).toBeVisible();

  const taskA = page.getByText('Task A', { exact: true });
  const taskB = page.getByText('Task B', { exact: true });
  const taskC = page.getByText('Task C', { exact: true });

  // test: move task to bottom
  await taskC.hover();

  const handleC = page.getByRole('button', { name: 'Task C' }).getByRole('button');
  await handleC.dragTo(taskA);

  const tasks1 = page.getByRole('button', { name: 'Task' });

  await expect(tasks1.nth(0)).toContainText('Task B');
  await expect(tasks1.nth(1)).toContainText('Task A');
  await expect(tasks1.nth(2)).toContainText('Task C');

  await page.reload();

  const tasks1AfterReload = page.getByRole('button', { name: 'Task' });

  await expect(tasks1AfterReload.nth(0)).toContainText('Task B');
  await expect(tasks1AfterReload.nth(1)).toContainText('Task A');
  await expect(tasks1AfterReload.nth(2)).toContainText('Task C');

  // test: move task to middle
  await taskB.hover();
  const handleB = page.getByRole('button', { name: 'Task B' }).getByRole('button');
  await handleB.dragTo(taskA);

  const tasks2 = page.getByRole('button', { name: 'Task' });

  await expect(tasks2.nth(0)).toContainText('Task A');
  await expect(tasks2.nth(1)).toContainText('Task B');
  await expect(tasks2.nth(2)).toContainText('Task C');

  await page.reload();

  const tasks2AfterReload = page.getByRole('button', { name: 'Task' });

  await expect(tasks2AfterReload.nth(0)).toContainText('Task A');
  await expect(tasks2AfterReload.nth(1)).toContainText('Task B');
  await expect(tasks2AfterReload.nth(2)).toContainText('Task C');

  // test: move task to top
  await taskC.hover();
  const handleCBottom = page.getByRole('button', { name: 'Task C' }).getByRole('button');
  await handleCBottom.dragTo(taskA);

  const tasks3 = page.getByRole('button', { name: 'Task' });

  await expect(tasks3.nth(0)).toContainText('Task C');
  await expect(tasks3.nth(1)).toContainText('Task A');
  await expect(tasks3.nth(2)).toContainText('Task B');

  await page.reload();

  const tasks3AfterReload = page.getByRole('button', { name: 'Task' });

  await expect(tasks3AfterReload.nth(0)).toContainText('Task C');
  await expect(tasks3AfterReload.nth(1)).toContainText('Task A');
  await expect(tasks3AfterReload.nth(2)).toContainText('Task B');
});
