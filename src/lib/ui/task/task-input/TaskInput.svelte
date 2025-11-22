<script lang="ts">
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import type { CalendarDateTime, DateValue } from '@internationalized/date';
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
	let selectedGroupId = $state<string | null>(null);
	let date = $state<CalendarDateTime | null>(null);

	$effect(() => {
		focused = focused || newTaskContent.trim().length > 0;
	});

	function handleEnter(content: string) {}

	function handleGroupSelect(groupId: string | null) {}

	function handleDateTimeChange() {}
</script>

<div
	class="relative flex h-14 w-full items-center gap-3 rounded-lg border border-neutral-300 bg-white
       px-3 pr-1 transition-all duration-200 ease-in-out
      dark:border-neutral-700 dark:bg-neutral-900
      dark:placeholder:text-neutral-500 dark:focus:ring-white {focused
		? 'border-transparent ring-2 ring-black dark:ring-white'
		: ''}"
>
	{#if focused}
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

	{#if focused && newTaskContent.trim().length !== 0}
		<TaskInputDropdowns />
	{/if}
</div>
