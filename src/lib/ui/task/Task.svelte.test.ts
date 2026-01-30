import { render, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const vibrateMock = vi.fn();
const ANIMATION_DURATION = 250;

import Task from './Task.svelte';
import type { TaskGroup } from '$lib/server/db/schema';

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
    const orderTask = vi.fn();
    const taskGroups: TaskGroup[] = [];
    const draggedTaskId = '';
    const selectedTaskId = '';
    const task = {
      id: 'task-1',
      userId: '1',
      content: 'Test task',
      completedAt: null,
      isImportant: false,
      taskGroupId: null,
      dueDate: null,
      order: null,
      repeatUnit: null,
      repeatInterval: null,
      repeatDays: null,
      repeatTime: null,
      completionStreak: 0,
      createdAt: new Date()
    };

    const { getByRole } = render(Task, {
      task,
      updateTask,
      orderTask,
      taskGroups,
      draggedTaskId,
      selectedTaskId
    });

    const button = getByRole('checkbox');

    // click the checkbox (TaskCheck component delays the callback)
    await fireEvent.click(button);

    // advance timers so the delayed toggle in TaskCheck fires
    vi.advanceTimersByTime(ANIMATION_DURATION);

    expect(vibrateMock).toHaveBeenCalledTimes(1);
    expect(vibrateMock).toHaveBeenCalledWith(50);

    // ensure updateTask was called with non-null value
    expect(updateTask).toHaveBeenCalledWith(task.id, {
      completedAt: expect.anything(),
      completionStreak: expect.anything()
    });
  });

  it('schedules next due date and clears completedAt when task has repeat', async () => {
    const updateTask = vi.fn();
    const orderTask = vi.fn();
    const taskGroups: TaskGroup[] = [];
    const draggedTaskId = '';
    const selectedTaskId = '';
    const due = new Date(2026, 0, 1, 0, 0, 0);
    const task = {
      id: 'task-2',
      userId: '1',
      content: 'Repeating task',
      completedAt: null,
      isImportant: false,
      taskGroupId: null,
      dueDate: due,
      order: null,
      repeatUnit: 'day',
      repeatInterval: 2,
      repeatDays: null,
      repeatTime: null,
      completionStreak: 0,
      createdAt: new Date()
    };

    const { getByRole } = render(Task, {
      task,
      updateTask,
      orderTask,
      taskGroups,
      draggedTaskId,
      selectedTaskId
    });

    const button = getByRole('checkbox');

    await fireEvent.click(button);

    vi.advanceTimersByTime(ANIMATION_DURATION);

    expect(updateTask).toHaveBeenCalledTimes(1);

    const firstCall = updateTask.mock.calls[0];
    expect(firstCall[0]).toBe(task.id);
    const updates = firstCall[1];

    // expected next due is +2 days
    const expectedNext = new Date(due);
    expectedNext.setDate(expectedNext.getDate() + 2);

    expect(updates.dueDate).toBeInstanceOf(Date);
    expect(updates.dueDate.toISOString()).toBe(expectedNext.toISOString());
    expect(updates.completedAt).toBeInstanceOf(Date);
    expect(updates.completionStreak).toBeDefined();

    // advance timers for the 2000ms completedAt reset
    vi.advanceTimersByTime(2000);

    expect(updateTask).toHaveBeenCalledTimes(2);
    expect(updateTask).toHaveBeenNthCalledWith(2, task.id, { completedAt: null });
  });

  it('marks completed without scheduling next due date for non-repeating task', async () => {
    const updateTask = vi.fn();
    const orderTask = vi.fn();
    const taskGroups: TaskGroup[] = [];
    const draggedTaskId = '';
    const selectedTaskId = '';
    const task = {
      id: 'task-3',
      userId: '1',
      content: 'One-off task',
      completedAt: null,
      isImportant: false,
      taskGroupId: null,
      dueDate: null,
      order: null,
      repeatUnit: null,
      repeatInterval: null,
      repeatDays: null,
      repeatTime: null,
      completionStreak: 0,
      createdAt: new Date()
    };

    const { getByRole } = render(Task, {
      task,
      updateTask,
      orderTask,
      taskGroups,
      draggedTaskId,
      selectedTaskId
    });

    const button = getByRole('checkbox');

    await fireEvent.click(button);

    vi.advanceTimersByTime(ANIMATION_DURATION);

    expect(updateTask).toHaveBeenCalledTimes(1);
    const call = updateTask.mock.calls[0];
    expect(call[0]).toBe(task.id);
    const updates = call[1];
    expect(updates.completedAt).toBeInstanceOf(Date);
    expect(updates.dueDate).toBeUndefined();
  });
});
