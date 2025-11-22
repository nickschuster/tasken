<script lang="ts">
	import DropDownItem from '$lib/ui/dropdown/DropDownItem.svelte';
	import DropdownMenuContent from '$lib/ui/dropdown/DropDownContent.svelte';
	import { CalendarIcon, House } from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';

	let { taskGroups } = $props();
</script>

<div class="flex items-center gap-1">
	{#if taskGroups.length > 0}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button class="flex gap-2 rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950">
					<House />
					<span>Tasks</span>
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenuContent contentProps={{ side: 'top' }}>
					<DropDownItem
						callback={() => {
							console.log('click');
						}}
					>
						All Tasks
					</DropDownItem>
				</DropdownMenuContent>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	{/if}

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<button class="rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950">
				<CalendarIcon />
			</button>
		</DropdownMenu.Trigger>

		<DropdownMenu.Portal>
			<DropdownMenu.Content>
				<DropdownMenu.Item />
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>
