import { describe, it, expect, vi } from 'vitest';
import DetailedTaskView from './DetailedTaskView.svelte';
import { render, fireEvent } from '@testing-library/svelte';

describe('DetailedTaskView.svelte', () => {
	it('renders with initial data', () => {
		const taskName = 'Test Task';

		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: taskName,
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { queryByText, getByDisplayValue } = render(DetailedTaskView, props);

		expect(queryByText('Task Details')).toBeTruthy();
		expect(getByDisplayValue(taskName)).toBeTruthy();
		expect(queryByText('No Group')).toBeTruthy();
	});

	it('toggles isImportant status', async () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Test Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { getByRole } = render(DetailedTaskView, props);

		const toggleButton = getByRole('button', { name: 'Is Important Toggle' });

		expect(props.selectedTask.isImportant).toBe(false);

		await fireEvent.click(toggleButton);

		expect(props.updateTask).toHaveBeenCalledWith(props.selectedTask.id, { isImportant: true });
	});
});
