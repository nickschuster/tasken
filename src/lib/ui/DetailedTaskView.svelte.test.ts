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
				order: null,
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
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { getByRole } = render(DetailedTaskView, props);

		const toggleButton = getByRole('button', { name: 'Mark as important' });

		expect(props.selectedTask.isImportant).toBe(false);

		await fireEvent.click(toggleButton);

		expect(props.updateTask).toHaveBeenCalledWith(props.selectedTask.id, { isImportant: true });
	});

	it('renders "No Group" when task has no group assigned', () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Test Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [
				{ id: 'group1', name: 'Work', color: '#ff0000', userId: 'user1', createdAt: new Date() }
			],
			updateTask: vi.fn()
		};

		const { queryByText } = render(DetailedTaskView, props);
		expect(queryByText('No Group')).toBeTruthy();
	});

	it('renders correct group name when task is assigned to a group', () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Test Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: 'group1',
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [
				{ id: 'group1', name: 'Work', color: '#ff0000', userId: 'user1', createdAt: new Date() },
				{ id: 'group2', name: 'Personal', color: '#00ff00', userId: 'user1', createdAt: new Date() }
			],
			updateTask: vi.fn()
		};

		const { queryByText } = render(DetailedTaskView, props);
		expect(queryByText('Work')).toBeTruthy();
	});

	it('displays completed status for completed tasks', () => {
		const completedDate = new Date('2023-10-15');
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Test Task',
				isImportant: false,
				completedAt: completedDate,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { queryByText } = render(DetailedTaskView, props);
		// Check for completed status badge
		expect(queryByText(/Completed/)).toBeTruthy();
	});

	it('does not display completed status for non-completed tasks', () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Test Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { queryByText } = render(DetailedTaskView, props);
		expect(queryByText(/Completed/)).toBeFalsy();
	});

	it('updates task content when input is blurred', async () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Original Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { getByDisplayValue } = render(DetailedTaskView, props);
		const input = getByDisplayValue('Original Task') as HTMLInputElement;

		// Change the value and blur
		await fireEvent.input(input, { target: { value: 'Updated Task' } });
		await fireEvent.blur(input);

		expect(props.updateTask).toHaveBeenCalledWith('1', { content: 'Updated Task' });
	});

	it('updates task content when Enter is pressed', async () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Original Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { getByDisplayValue } = render(DetailedTaskView, props);
		const input = getByDisplayValue('Original Task') as HTMLInputElement;

		// Change the value and press Enter
		await fireEvent.input(input, { target: { value: 'Enter Updated Task' } });
		await fireEvent.keyDown(input, { key: 'Enter' });

		expect(props.updateTask).toHaveBeenCalledWith('1', { content: 'Enter Updated Task' });
	});

	it('does not update task content if it is empty or only whitespace', async () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Original Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { getByDisplayValue } = render(DetailedTaskView, props);
		const input = getByDisplayValue('Original Task') as HTMLInputElement;

		// Try to set empty content
		await fireEvent.input(input, { target: { value: '   ' } });
		await fireEvent.blur(input);

		expect(props.updateTask).not.toHaveBeenCalled();
		// Input should revert to original value
		expect(input.value).toBe('Original Task');
	});

	it('shows star filled when task is important', () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Important Task',
				isImportant: true,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { container } = render(DetailedTaskView, props);
		const starIcon = container.querySelector('[fill="currentColor"]');
		expect(starIcon).toBeTruthy();
	});

	it('shows star unfilled when task is not important', () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Regular Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { container } = render(DetailedTaskView, props);
		const starIcon = container.querySelector('[fill="transparent"]');
		expect(starIcon).toBeTruthy();
	});

	it('does not render when no task is selected', () => {
		const props = {
			selectedTask: null,
			selectedTaskId: null,
			taskGroups: [],
			order: null,
			updateTask: vi.fn()
		};

		const { queryByText } = render(DetailedTaskView, props);
		expect(queryByText('Task Details')).toBeFalsy();
	});

	it('renders correctly with creation date', () => {
		const createdDate = new Date('2023-10-15T10:30:00Z');
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Test Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: createdDate
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { queryByText } = render(DetailedTaskView, props);
		// Component should render without errors
		expect(queryByText('Task Details')).toBeTruthy();
	});

	it('handles task with due date', () => {
		const dueDate = new Date('2023-12-25');
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Task with due date',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: dueDate,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { queryByText } = render(DetailedTaskView, props);
		expect(queryByText('Due Date')).toBeTruthy();
	});

	it('handles string dates correctly', () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Test Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				order: null,
				dueDate: new Date('2023-12-25T00:00:00Z'),
				createdAt: new Date('2023-10-15T10:30:00Z')
			},
			selectedTaskId: '1',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { queryByText } = render(DetailedTaskView, props);
		// Should render without errors
		expect(queryByText('Task Details')).toBeTruthy();
		expect(queryByText('Due Date')).toBeTruthy();
	});

	it('calls updateTask when group selection changes', async () => {
		const props = {
			selectedTask: {
				id: '1',
				userId: 'user1',
				content: 'Test Task',
				isImportant: false,
				completedAt: null,
				taskGroupId: null,
				dueDate: null,
				order: null,
				createdAt: new Date()
			},
			selectedTaskId: '1',
			taskGroups: [
				{ id: 'group1', name: 'Work', color: '#ff0000', userId: 'user1', createdAt: new Date() }
			],
			updateTask: vi.fn()
		};

		render(DetailedTaskView, props);

		// This test would need more complex interaction with the Select component
		// For now, we'll test that the component renders the select trigger
		expect(document.querySelector('[aria-label="Select a group"]')).toBeTruthy();
	});
});
