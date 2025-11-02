import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskInput from './TaskInput.svelte';

// Mock the animate function for transitions
beforeEach(() => {
	Element.prototype.animate = vi.fn(() => ({
		finished: Promise.resolve(),
		cancel: vi.fn(),
		onfinish: null,
		currentTime: 0,
		playbackRate: 1
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	})) as any;
});

describe('TaskInput.svelte', () => {
	it('renders input with initial value', () => {
		const { getByRole } = render(TaskInput, {
			props: { newTaskContent: 'test value', taskGroups: [] }
		});
		const input = getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('test value');
	});

	it('updates value when typing', async () => {
		const { getByRole } = render(TaskInput, {
			props: { newTaskContent: '', taskGroups: [] }
		});
		const input = getByRole('textbox') as HTMLInputElement;

		await fireEvent.input(input, { target: { value: 'hello' } });
		// Svelte's bind:value updates prop, but not component prop directly
		expect(input.value).toBe('hello');
	});

	it('calls onEnter when Enter is pressed', async () => {
		const onEnter = vi.fn();
		const { getByRole } = render(TaskInput, {
			props: { newTaskContent: 'abc', taskGroups: [], onEnter }
		});
		const input = getByRole('textbox') as HTMLInputElement;

		await fireEvent.keyDown(input, { code: 'Enter', key: 'Enter' });
		expect(onEnter).toHaveBeenCalledWith('abc');
	});

	it('does not call onEnter on other keys', async () => {
		const onEnter = vi.fn();
		const { getByRole } = render(TaskInput, {
			props: { newTaskContent: 'abc', taskGroups: [], onEnter }
		});
		const input = getByRole('textbox') as HTMLInputElement;

		await fireEvent.keyDown(input, { code: 'Space', key: ' ' });
		expect(onEnter).not.toHaveBeenCalled();
	});

	it('applies correct classes', () => {
		const { getByRole, container } = render(TaskInput, {
			props: { newTaskContent: '', taskGroups: [] }
		});
		const input = getByRole('textbox') as HTMLInputElement;
		const wrapper = container.querySelector('div');

		// Check input classes
		expect(input.className).toContain('text-lg');
		expect(input.className).toContain('grow');

		// Check wrapper div classes
		expect(wrapper?.className).toContain('rounded-lg');
		expect(wrapper?.className).toContain('border');
	});
});
