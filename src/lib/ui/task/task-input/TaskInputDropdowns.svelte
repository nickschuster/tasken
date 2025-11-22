<script lang="ts">
	import { CalendarIcon, House } from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';
	import TaskInputGroupSelector from './TaskInputGroupSelector.svelte';
	import TaskInputDueDateSelector from './TaskInputDueDateSelector.svelte';

	let { taskGroups, selectedGroup, groupSelected, selectedDate, dateSelected } = $props();
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
				<TaskInputGroupSelector {taskGroups} {groupSelected} />
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
			<TaskInputDueDateSelector {selectedDate} {dateSelected} />
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>
