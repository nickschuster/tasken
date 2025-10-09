import { render, fireEvent } from '@testing-library/svelte';
import TaskCheck from './TaskCheck.svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const ANIMATION_DURATION = 200;

describe('TaskCheck component', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('renders with initial checked state and correct title', () => {
		const { getByRole } = render(TaskCheck, { checked: true, toggleChecked: () => {} });
		const button = getByRole('checkbox') as HTMLButtonElement;

		expect(button.getAttribute('aria-checked')).toBe('true');
		expect(button.getAttribute('title')).toBe('Uncheck');
	});

	it('toggles visually on click and calls toggleChecked after animation delay', async () => {
		const toggle = vi.fn();
		const { getByRole } = render(TaskCheck, { checked: false, toggleChecked: toggle });
		const button = getByRole('checkbox') as HTMLButtonElement;

		// initial
		expect(button.getAttribute('aria-checked')).toBe('false');
		expect(button.getAttribute('title')).toBe('Check');

		// click -> immediate visual toggle
		await fireEvent.click(button);
		expect(button.getAttribute('aria-checked')).toBe('true');
		expect(button.getAttribute('title')).toBe('Uncheck');

		// advance timers to trigger callback
		vi.advanceTimersByTime(ANIMATION_DURATION);
		expect(toggle).toHaveBeenCalledTimes(1);
		expect(toggle).toHaveBeenCalledWith(true);

		// click again -> toggles back
		await fireEvent.click(button);
		expect(button.getAttribute('aria-checked')).toBe('false');
		vi.advanceTimersByTime(ANIMATION_DURATION);
		expect(toggle).toHaveBeenCalledTimes(2);
		expect(toggle).toHaveBeenCalledWith(false);
	});

	it('toggles via keyboard (Space and Enter) and calls toggleChecked after delay', async () => {
		const toggle = vi.fn();
		const { getByRole } = render(TaskCheck, { checked: false, toggleChecked: toggle });
		const button = getByRole('checkbox') as HTMLButtonElement;

		// Space key
		await fireEvent.keyDown(button, { key: ' ' });
		expect(button.getAttribute('aria-checked')).toBe('true');
		vi.advanceTimersByTime(ANIMATION_DURATION);
		expect(toggle).toHaveBeenCalledTimes(1);
		expect(toggle).toHaveBeenCalledWith(true);

		// Enter key
		await fireEvent.keyDown(button, { key: 'Enter' });
		expect(button.getAttribute('aria-checked')).toBe('false');
		vi.advanceTimersByTime(ANIMATION_DURATION);
		expect(toggle).toHaveBeenCalledTimes(2);
		expect(toggle).toHaveBeenCalledWith(false);
	});
});
