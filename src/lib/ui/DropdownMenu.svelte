<script lang="ts">
	import { DropdownMenu, type WithoutChild } from 'bits-ui';

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
		<DropdownMenu.Content
			{...contentProps}
			class="
				z-100 min-w-[180px] rounded-lg border
				border-neutral-200 bg-white p-1.5
				shadow-md focus:outline-none
				dark:border-neutral-700 dark:bg-neutral-900
			"
		>
			<DropdownMenu.Group aria-label={buttonText}>
				{#each items as item (item.id)}
					<DropdownMenu.Item
						textValue={item.name}
						class={[
							'cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-900 transition',
							'hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none',
							'dark:text-neutral-100  dark:focus:bg-neutral-700'
						]}
						onclick={() => item.action?.()}
					>
						<div class="flex flex-row items-center justify-between">
							{item.name}
							{#if item.icon}
								<item.icon class="size-5" />
							{/if}
						</div>
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
