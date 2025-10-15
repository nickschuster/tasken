<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DropdownMenu, type WithoutChild } from 'bits-ui';

	type Props = DropdownMenu.RootProps & {
		buttonText: string;
		items: { id: string; name: string }[];
		contentProps?: WithoutChild<DropdownMenu.ContentProps>;
		onSelect?: (item: (typeof items)[number]) => void;
	};

	let {
		open = $bindable(false),
		buttonText,
		items,
		contentProps,
		onSelect,
		...restProps
	}: Props = $props();
</script>

<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger
		class="
			focus:black dark:focus:white inline-flex
			items-center justify-center rounded-md border
			border-neutral-300 bg-white px-3 py-2 text-sm
			font-medium text-neutral-900 transition hover:bg-neutral-100
			focus:ring-2 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900
			dark:text-neutral-100 dark:hover:bg-neutral-800
		"
	>
		{buttonText}
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			{...contentProps}
			class="
				min-w-[180px] rounded-lg border border-neutral-200
				bg-white p-1.5 shadow-md
				focus:outline-none dark:border-neutral-700
				dark:bg-neutral-900
			"
		>
			<DropdownMenu.Group aria-label={buttonText}>
				{#each items as item}
					<DropdownMenu.Item
						textValue={item.name}
						class="
							cursor-pointer rounded-md px-3 py-2 text-sm
							text-neutral-900 transition
							hover:bg-neutral-100 focus:bg-neutral-200
							focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-800
							dark:focus:bg-neutral-700
						"
						onclick={() => onSelect?.(item)}
					>
						{item.name}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
