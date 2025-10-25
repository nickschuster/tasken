import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import TaskInput from './TaskInput.svelte';

describe('TaskInput.svelte', () => {
	it('renders input with initial value', () => {
		const { getByRole } = render(TaskInput, { newTaskContent: 'test value' });
		const input = getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('test value');
	});

	it('updates value when typing', async () => {
		const { getByRole } = render(TaskInput, { newTaskContent: '' });
		const input = getByRole('textbox') as HTMLInputElement;

		await fireEvent.input(input, { target: { value: 'hello' } });
		// Svelte's bind:value updates prop, but not component prop directly
		expect(input.value).toBe('hello');
	});

	it('calls onEnter when Enter is pressed', async () => {
		const onEnter = vi.fn();
		const { getByRole } = render(TaskInput, { newTaskContent: 'abc', onEnter });
		const input = getByRole('textbox') as HTMLInputElement;

		await fireEvent.keyDown(input, { code: 'Enter', key: 'Enter' });
		expect(onEnter).toHaveBeenCalledWith('abc');
	});

	it('does not call onEnter on other keys', async () => {
		const onEnter = vi.fn();
		const { getByRole } = render(TaskInput, { newTaskContent: 'abc', onEnter });
		const input = getByRole('textbox') as HTMLInputElement;

		await fireEvent.keyDown(input, { code: 'Space', key: ' ' });
		expect(onEnter).not.toHaveBeenCalled();
	});

	it('applies correct classes', () => {
		const { getByRole } = render(TaskInput, { newTaskContent: '' });
		const input = getByRole('textbox') as HTMLInputElement;
		expect(input.className).toContain('rounded-lg');
		expect(input.className).toContain('border');
		expect(input.className).toContain('text-lg');
	});
});
