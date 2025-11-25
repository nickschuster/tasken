<script lang="ts">
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import { getLocalTimeZone, CalendarDate } from '@internationalized/date';
	import { Circle, Plus } from '@lucide/svelte';
	import { elasticOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import TaskInputDropdowns from './TaskInputDropdowns.svelte';

	let {
		taskGroups = [],
		newTaskContent = $bindable(''),
		onEnter = () => {}
	}: {
		taskGroups: TaskGroup[];
		newTaskContent?: string;
		onEnter?: (task: Partial<Task>) => void;
	} = $props();

	let focused = $state(false);
	let showContextMenu = $derived(focused || newTaskContent.trim().length > 0);
	let selectedGroup = $state<TaskGroup | null>(null);
	let selectedDate = $state<CalendarDate | null>(null);
	let customDate = $state<CalendarDate | undefined>(undefined);

	function handleEnter(content: string) {
		if (content.trim().length === 0) return;

		onEnter({
			content: content.trim(),
			taskGroupId: selectedGroup?.id,
			dueDate: selectedDate?.toDate(getLocalTimeZone())
		});

		newTaskContent = '';
		selectedGroup = null;
		selectedDate = null;
	}

	function groupSelected(group: TaskGroup | null) {
		selectedGroup = group;
	}

	function dateSelected(date: CalendarDate | null) {
		selectedDate = date;
	}
</script>

<div
	class="relative flex h-14 w-full items-center gap-3 rounded-lg border border-neutral-300 bg-white
       px-3 pr-1 transition-all duration-200 ease-in-out
      dark:border-neutral-700 dark:bg-neutral-900
      dark:placeholder:text-neutral-500 dark:focus:ring-white {showContextMenu
		? 'border-transparent ring-2 ring-black dark:ring-white'
		: ''}"
>
	{#if showContextMenu}
		<div in:fade={{ duration: 200, easing: elasticOut }}>
			<Circle size="28" />
		</div>
	{:else}
		<Plus class="display-none text-neutral-500" />
	{/if}

	<input
		type="text"
		class=" grow text-lg
      text-black placeholder:text-neutral-400 focus:outline-none dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-500"
		bind:focused
		bind:value={newTaskContent}
		onkeydown={(event) => {
			if (event.code === 'Enter') {
				handleEnter(newTaskContent);
			}
		}}
	/>

	{#if showContextMenu && newTaskContent.trim().length !== 0}
		<TaskInputDropdowns
			{taskGroups}
			{selectedGroup}
			{groupSelected}
			{selectedDate}
			{customDate}
			{dateSelected}
		/>
	{/if}
</div>
