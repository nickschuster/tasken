import { render, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const vibrateMock = vi.fn();
const ANIMATION_DURATION = 250;

import Task from './Task.svelte';

let originalNavigator: Navigator | undefined;
let originalMatchMedia: typeof window.matchMedia | undefined;

describe('Task component vibration', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vibrateMock.mockReset();

		// Save originals so we can restore later
		originalNavigator =
			typeof globalThis.navigator !== 'undefined' ? globalThis.navigator : undefined;
		originalMatchMedia = typeof window.matchMedia === 'function' ? window.matchMedia : undefined;

		// Provide a navigator mock with vibrate
		const navMock = { vibrate: vibrateMock } as unknown as Navigator;
		Object.defineProperty(globalThis, 'navigator', { value: navMock, configurable: true });

		// mock matchMedia to not opt-out vibration
		const mm = (() =>
			({
				matches: false,
				addListener: () => {},
				removeListener: () => {}
			}) as unknown as MediaQueryList) as unknown as (query: string) => MediaQueryList;
		Object.defineProperty(window, 'matchMedia', { value: mm, configurable: true });
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();

		// Restore originals
		if (typeof originalNavigator !== 'undefined') {
			Object.defineProperty(globalThis, 'navigator', {
				value: originalNavigator,
				configurable: true
			});
		} else {
			// remove the test navigator if there was none
			// remove test navigator property
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore - remove property added for tests
			delete (globalThis as unknown as Record<string, unknown>).navigator;
		}

		if (typeof originalMatchMedia !== 'undefined') {
			Object.defineProperty(window, 'matchMedia', {
				value: originalMatchMedia,
				configurable: true
			});
		} else {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore - remove matchMedia added for tests
			delete (window as unknown as Record<string, unknown>).matchMedia;
		}
	});

	it('calls vibrate when task is completed via the checkbox', async () => {
		const updateTask = vi.fn();
		const task = {
			id: 'task-1',
			userId: '1',
			content: 'Test task',
			completedAt: null,
			isImportant: false,
			taskGroupId: null,
			dueDate: null,
			createdAt: new Date()
		};

		const { getByRole } = render(Task, { task, updateTask });

		const button = getByRole('checkbox');

		// click the checkbox (TaskCheck component delays the callback)
		await fireEvent.click(button);

		// advance timers so the delayed toggle in TaskCheck fires
		vi.advanceTimersByTime(ANIMATION_DURATION);

		expect(vibrateMock).toHaveBeenCalledTimes(1);
		expect(vibrateMock).toHaveBeenCalledWith(50);

		// ensure updateTask was called with non-null value
		expect(updateTask).toHaveBeenCalledWith(task.id, {
			completedAt: expect.anything()
		});
	});
});
