<script lang="ts">
	import { DropdownMenu } from 'bits-ui';

	let { contentProps, children } = $props();
</script>

<DropdownMenu.Content
	{...contentProps}
	class="
				z-100 min-w-[180px] rounded-lg border
				border-neutral-200 bg-white p-1.5
				shadow-md focus:outline-none
				dark:border-neutral-700 dark:bg-neutral-900
			"
>
	{@render children()}
</DropdownMenu.Content>
