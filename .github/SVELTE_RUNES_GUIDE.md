# Svelte 5 Runes Guide

This project uses Svelte 5 runes exclusively. All new components must use the modern runes syntax.

## Migration Summary

All components have been migrated from the old Svelte syntax to Svelte 5 runes:

### Old Syntax (Deprecated)
```svelte
<script>
  export let prop1 = 'default';
  export let prop2;
  
  let state = 'value';
  
  $: computed = state + '!';
</script>

<button on:click={handler}>Click</button>
```

### New Syntax (Required)
```svelte
<script>
  type Props = {
    prop1?: string;
    prop2: string;
  };
  
  let { prop1 = 'default', prop2 }: Props = $props();
  
  let state = $state('value');
  
  let computed = $derived(state + '!');
</script>

<button onclick={handler}>Click</button>
```

## Key Changes

### 1. Props Definition
- **Old**: `export let propName = defaultValue;`
- **New**: Use `$props()` rune with TypeScript type definition

```svelte
<script lang="ts">
  type Props = {
    name?: string;
    count: number;
  };
  
  let { name = 'default', count }: Props = $props();
</script>
```

### 2. State Management
- **Old**: `let state = value;` (reactive by default)
- **New**: Use `$state()` rune for reactive state

```svelte
<script>
  let count = $state(0);
  let isOpen = $state(false);
</script>
```

### 3. Computed Values
- **Old**: `$: computed = expression;`
- **New**: Use `$derived()` rune

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

### 4. Side Effects
- **Old**: `$: { /* code */ }`
- **New**: Use `$effect()` rune

```svelte
<script>
  let count = $state(0);
  
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>
```

### 5. Bindable Props (Two-way binding)
- **Old**: `export let value;` (bind:value in parent)
- **New**: Use `$bindable()` rune

```svelte
<script>
  type Props = {
    value?: string;
  };
  
  let { value = $bindable('') }: Props = $props();
</script>
```

### 6. Event Handlers
- **Old**: `on:click`, `on:keydown`, etc.
- **New**: Use DOM property syntax: `onclick`, `onkeydown`, etc.

```svelte
<!-- Old -->
<button on:click={handleClick}>Click</button>
<input on:keydown={handleKeydown} />

<!-- New -->
<button onclick={handleClick}>Click</button>
<input onkeydown={handleKeydown} />
```

### 7. Slots
- **Old**: `<slot></slot>`
- **New**: Use `{@render}` tags

```svelte
<!-- Old -->
<slot></slot>

<!-- New -->
let { children } = $props();
{@render children?.()}
```

## Linting Rules

The following ESLint rules are enabled to enforce best practices with runes:

- `svelte/no-reactive-functions`: Prevents defining functions in reactive statements
- `svelte/no-reactive-literals`: Prevents using literals in reactive statements
- `svelte/no-reactive-reassign`: Warns about reassignment in reactive statements
- `svelte/prefer-svelte-reactivity`: Encourages using Svelte's reactivity

## Checking for Old Syntax

To check if any components still use old syntax, you can run:

```bash
# Check for export let (old props syntax)
grep -r "export let" src/**/*.svelte

# Check for old event handlers (on:)
grep -r "on:" src/**/*.svelte

# Check for old reactive statements ($:)
grep -r "\$:" src/**/*.svelte | grep -v "derived\|effect\|state\|bindable\|props"

# Check for old slot syntax
grep -r "<slot" src/**/*.svelte
```

## Benefits of Runes

1. **Explicit Reactivity**: Clear distinction between reactive and non-reactive state
2. **Better TypeScript Support**: Type-safe props with proper type definitions
3. **Performance**: More efficient reactivity tracking
4. **Clearer Intent**: Code is more readable and maintainable
5. **Future-proof**: Aligned with Svelte's future direction

## Resources

- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/what-are-runes)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
