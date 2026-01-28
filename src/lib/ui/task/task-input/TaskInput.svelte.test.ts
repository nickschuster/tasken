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
    expect(onEnter).toHaveBeenCalledWith({
      content: 'abc',
      taskGroupId: undefined,
      dueDate: undefined
    });
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

  it('opens and renders the duedate context menu', async () => {
    const { getAllByRole, getByText } = render(TaskInput, {
      props: { newTaskContent: 'test', taskGroups: [] }
    });

    const trigger = getAllByRole('button', { name: /schedule/i });

    await fireEvent.click(trigger[0]);

    const todayButton = getByText('Today');
    const tomorrowButton = getByText('Tomorrow');
    const cancelButton = getByText('Clear');

    expect(todayButton.textContent.trim()).toBe('Today');
    expect(tomorrowButton.textContent.trim()).toBe('Tomorrow');
    expect(cancelButton.textContent.trim()).toBe('Clear');
  });

  it('selects and saves the today duedate', async () => {
    const onEnter = vi.fn();
    const { getAllByRole, getByRole, getByText } = render(TaskInput, {
      props: { newTaskContent: 'test', taskGroups: [], onEnter }
    });

    const input = getByRole('textbox') as HTMLInputElement;
    const trigger = getAllByRole('button', { name: /schedule/i });

    await fireEvent.click(trigger[0]);

    const todayButton = getByText('Today');

    await fireEvent.click(todayButton);

    await fireEvent.keyDown(input, { code: 'Enter', key: 'Enter' });

    expect(onEnter).toHaveBeenCalled();
    const call = onEnter.mock.calls[0][0];

    expect(call.dueDate).toBeTruthy();
  });

  it('selects and saves the tomorrow duedate', async () => {
    const onEnter = vi.fn();
    const { getAllByRole, getByRole, getByText } = render(TaskInput, {
      props: { newTaskContent: 'test', taskGroups: [], onEnter }
    });

    const input = getByRole('textbox') as HTMLInputElement;
    const trigger = getAllByRole('button', { name: /schedule/i });

    await fireEvent.click(trigger[0]);

    const tomorrowButton = getByText('Tomorrow');

    await fireEvent.click(tomorrowButton);

    await fireEvent.keyDown(input, { code: 'Enter', key: 'Enter' });

    const call = onEnter.mock.calls[0][0];
    expect(call.dueDate).toBeTruthy();
  });

  it('clears the duedate', async () => {
    const onEnter = vi.fn();
    const { getAllByRole, getByRole, getByText } = render(TaskInput, {
      props: { newTaskContent: 'test', taskGroups: [], onEnter }
    });

    const input = getByRole('textbox') as HTMLInputElement;
    const trigger = getAllByRole('button', { name: /schedule/i });

    await fireEvent.click(trigger[0]);

    const tomorrowButton = getByText('Tomorrow');

    await fireEvent.click(tomorrowButton);

    await fireEvent.click(trigger[0]);

    const cancelButton = getByText('Clear');

    await fireEvent.click(cancelButton);

    await fireEvent.keyDown(input, { code: 'Enter', key: 'Enter' });

    const call = onEnter.mock.calls[0][0];
    expect(call.dueDate).toBeFalsy();
  });

  it('selects and saves a taskgroup', async () => {
    const onEnter = vi.fn();
    const { getAllByRole, getByRole, getByText } = render(TaskInput, {
      props: {
        newTaskContent: 'test',
        taskGroups: [
          { id: '1', color: '#fff', createdAt: new Date(), userId: '1', name: 'testGroup' }
        ],
        onEnter
      }
    });

    const input = getByRole('textbox') as HTMLInputElement;
    const trigger = getAllByRole('button', { name: /Assign/i });

    await fireEvent.click(trigger[0]);

    const taskGroupButton = getByText('testGroup');

    expect(taskGroupButton.textContent.trim()).toBe('testGroup');

    await fireEvent.click(taskGroupButton);

    await fireEvent.keyDown(input, { code: 'Enter', key: 'Enter' });

    const call = onEnter.mock.calls[0][0];
    expect(call.taskGroupId).toBeTruthy();
  });
});
