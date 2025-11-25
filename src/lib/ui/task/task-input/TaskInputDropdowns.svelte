<script lang="ts">
	import { CalendarIcon, House } from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';
	import TaskInputGroupSelector from './TaskInputGroupSelector.svelte';
	import TaskInputDueDateSelector from './TaskInputDueDateSelector.svelte';
	import type { TaskGroup } from '$lib/server/db/schema';
	import type { CalendarDate } from '@internationalized/date';

	type Props = {
		taskGroups: TaskGroup[];
		selectedGroup: TaskGroup | null;
		groupSelected: (group: TaskGroup | null) => void;
		selectedDate: CalendarDate | null;
		customDate: CalendarDate | undefined;
		dateSelected: (date: CalendarDate | null) => void;
	};

	let { taskGroups, selectedGroup, groupSelected, selectedDate, customDate, dateSelected }: Props =
		$props();
</script>

<div class="flex items-center gap-1">
	{#if taskGroups.length > 0}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button class="flex gap-2 rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950">
					{#if selectedGroup}
						<div
							style={'background-color: ' + selectedGroup.color}
							class="m-1 size-3 rounded-full"
						></div>
						<div>{selectedGroup.name}</div>
					{:else}
						<House />
						<span class="text-neutral-400">Assign</span>
					{/if}
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<TaskInputGroupSelector {taskGroups} {groupSelected} />
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	{/if}

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<button class="flex gap-2 rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950">
				<CalendarIcon />
				{#if selectedDate}
					<span>{selectedDate}</span>
				{:else}
					<span class="text-neutral-400">Schedule</span>
				{/if}
			</button>
		</DropdownMenu.Trigger>

		<DropdownMenu.Portal>
			<TaskInputDueDateSelector {dateSelected} {customDate} {selectedDate} />
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>
