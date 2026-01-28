import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Collapsible from './Collapsible.svelte';

describe('Collapsible.svelte', () => {
  it('renders with initial header', () => {
    const { getByRole } = render(Collapsible, { headerText: 'Test Header' });
    const header = getByRole('button') as HTMLButtonElement;
    expect(header.textContent.trim()).toBe('Test Header');
  });
});
