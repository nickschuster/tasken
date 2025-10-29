import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import DetailedTaskView from './DetailedTaskView.svelte';

describe('DetailedTaskView.svelte', () => {
	it('renders with initial header', () => {
		const props = {
			selectedTask: null,
			selectedTaskId: '',
			taskGroups: [],
			updateTask: vi.fn()
		};

		const { queryByText } = render(DetailedTaskView, props);

		expect(queryByText('Task Details')).toBeFalsy();
	});
});
