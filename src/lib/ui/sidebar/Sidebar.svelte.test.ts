import { fireEvent, render } from '@testing-library/svelte';
import { it, expect, vi, describe } from 'vitest';
import Sidebar from './Sidebar.svelte';

const ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn()
}));

vi.stubGlobal('ResizeObserver', ResizeObserver);

describe('Sidebar.svelte', () => {
  it('renders with default groups', () => {
    const props = {
      isSidebarOpen: true,
      selectedGroup: 'Tasks',
      taskGroups: [],
      createTaskGroup: vi.fn(),
      updateTaskGroup: vi.fn(),
      deleteTaskGroup: vi.fn()
    };

    const { getByText } = render(Sidebar, props);

    expect(getByText('Tasks')).toBeTruthy();
    expect(getByText('Planned')).toBeTruthy();
    expect(getByText('Important')).toBeTruthy();

    expect(getByText('Your Lists')).toBeTruthy();
  });

  it('closes when chevron is clicked', () => {
    const props = {
      isSidebarOpen: true,
      selectedGroup: 'Tasks',
      taskGroups: [],
      createTaskGroup: vi.fn(),
      updateTaskGroup: vi.fn(),
      deleteTaskGroup: vi.fn()
    };

    const { queryByText, getByRole } = render(Sidebar, props);

    const button = getByRole('button', { name: 'Toggle Sidebar' }) as HTMLButtonElement;

    fireEvent.click(button);

    expect(queryByText('Tasks')).toBeFalsy();
    expect(queryByText('Today')).toBeFalsy();
    expect(queryByText('Important')).toBeFalsy();

    expect(queryByText('Your Lists')).toBeFalsy();
  });

  it('adds a task group when create list is clicked', async () => {
    const createTaskGroup = vi.fn();

    const props = {
      isSidebarOpen: true,
      selectedGroup: 'Tasks',
      taskGroups: [],
      createTaskGroup,
      updateTaskGroup: vi.fn(),
      deleteTaskGroup: vi.fn()
    };

    const { getByRole } = render(Sidebar, props);

    const addListButton = getByRole('button', { name: 'Add List' });

    await fireEvent.click(addListButton);

    expect(createTaskGroup).toHaveBeenCalled();
  });
});
