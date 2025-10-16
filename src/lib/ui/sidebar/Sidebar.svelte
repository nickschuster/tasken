<script lang="ts">
	import { ChartBarStacked, HomeIcon, PlusIcon } from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { enhance } from '$app/forms';
	import { Button } from 'bits-ui';
	import type { TaskGroup } from '$lib/server/db/schema';
	import TaskGroupItem from './TaskGroupItem.svelte';

	type SidebarProps = {
		taskGroups: TaskGroup[];
		isOpen: boolean;
		selectedGroup: string;
		createTaskGroup: () => Promise<void>;
		updateTaskGroup: (taskGroupId: string, updates: Partial<TaskGroup>) => Promise<void>;
		deleteTaskGroup: (taskGroupId: string) => Promise<void>;
	};

	let {
		taskGroups,
		isOpen = $bindable(),
		selectedGroup = $bindable(),
		createTaskGroup,
		updateTaskGroup,
		deleteTaskGroup
	}: SidebarProps = $props();
	let isCollapsed = $state(false);
	let innerWidth = $state(0);
	let isMobile = $derived(innerWidth < 768);
	let today = DateTime.now().toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

	const defaultGroups = ['All', 'Today', 'Tomorrow', 'Important'] as const;

	function toggleSidebar() {
		if (isMobile) {
			isOpen = !isOpen;
		} else {
			isCollapsed = !isCollapsed;
		}
	}

	function closeMobileSidebar() {
		if (isMobile) isOpen = false;
	}
</script>

<svelte:window bind:innerWidth />

{#if isMobile && isOpen}
	<div class="fixed inset-0 z-40 bg-black opacity-50" onclick={closeMobileSidebar}></div>
{/if}

<div
	class={[
		'flex h-screen flex-col bg-white text-neutral-800 transition-all duration-300 dark:bg-neutral-900 dark:text-neutral-200',
		isMobile && 'fixed top-0 left-0 z-50 w-64 transform shadow-lg',
		isMobile && (isOpen ? 'translate-x-0' : '-translate-x-full'),
		!isMobile && 'md:static md:flex md:h-screen',
		!isMobile && (isCollapsed ? 'md:w-16' : 'md:w-64')
	]}
>
	<button class="m-2 rounded bg-neutral-800 p-2 text-white" onclick={toggleSidebar}>
		{isMobile ? '☰' : isCollapsed ? '›' : '‹'}
	</button>

	<h2 class="p-4">
		{#if !isCollapsed}{today}{:else}<HomeIcon />{/if}
	</h2>

	<ul class="flex flex-col gap-2 px-2">
		{#each defaultGroups as group}
			<li
				class="rounded-sm p-2"
				class:bg-neutral-500={selectedGroup === group}
				onclick={() => (selectedGroup = group)}
			>
				{#if !isCollapsed}<span>{group}</span>{:else}<span>{group.charAt(0)}</span>{/if}
			</li>
		{/each}
	</ul>

	<div class="flex flex-row items-center justify-center gap-2">
		<h2 class="px-2">
			{#if !isCollapsed}Your Category's{/if}
		</h2>
		<Button.Root
			type="submit"
			onclick={createTaskGroup}
			class="
		inline-flex items-center justify-center gap-2 rounded-lg
		bg-neutral-900 p-2 text-sm font-medium text-white
		shadow-sm transition-all duration-200
		ease-out hover:bg-neutral-800
		hover:shadow-md active:scale-95 dark:bg-neutral-100
		dark:text-neutral-900 dark:hover:bg-neutral-200
	"
		>
			<PlusIcon class="size-4" />
			{#if !isCollapsed}<span>Create</span>{/if}
		</Button.Root>
	</div>
	<ul class="flex flex-col gap-2 px-2">
		{#each taskGroups as group, i (group.id)}
			<TaskGroupItem {group} {isCollapsed} {updateTaskGroup} {deleteTaskGroup} />
		{/each}
	</ul>
</div>
