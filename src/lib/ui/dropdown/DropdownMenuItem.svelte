<script lang="ts">
  import { DropdownMenu } from 'bits-ui';

  let { callback, children } = $props();
</script>

<DropdownMenu.Item
  class={[
    'cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-900 transition',
    'hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none',
    'dark:text-neutral-100  dark:focus:bg-neutral-700'
  ]}
  onclick={(e) => callback(e)}
>
  {@render children()}
</DropdownMenu.Item>
