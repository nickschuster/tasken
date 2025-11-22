<script lang="ts">
	import { DropdownMenu, type WithoutChild } from 'bits-ui';
	import DropdownMenuItem from './dropdown/DropDownItem.svelte';
	import DropdownMenuContent from './dropdown/DropDownContent.svelte';

	type MenuItem = {
		id: string;
		name: string;
		icon?: any;
		action?: () => void;
	};

	type Props = DropdownMenu.RootProps & {
		buttonText: string;
		items: MenuItem[];
		contentProps?: WithoutChild<DropdownMenu.ContentProps>;
	};

	let { open = $bindable(false), buttonText, items, contentProps, ...restProps }: Props = $props();
</script>

<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger
		class="
			inline-flex cursor-pointer items-center
			justify-center rounded-md px-3 py-2 text-sm font-medium
			text-neutral-900 transition focus-visible:ring-2
			focus-visible:ring-black focus-visible:outline-none
		 dark:text-neutral-100 dark:focus-visible:ring-white
		"
	>
		{buttonText}
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenuContent {contentProps}>
			<DropdownMenu.Group aria-label={buttonText}>
				{#each items as item (item.id)}
					<DropdownMenuItem callback={item.action}>
						<div class="flex flex-row items-center justify-between">
							{item.name}
							{#if item.icon}
								<item.icon class="size-5" />
							{/if}
						</div>
					</DropdownMenuItem>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenuContent>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
