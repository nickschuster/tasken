<script lang="ts">
	import {
		ChevronRightIcon,
		PlusIcon,
		Calendar1Icon,
		CalendarPlusIcon,
		StarIcon,
		ListIcon
	} from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { Button, ScrollArea } from 'bits-ui';
	import type { TaskGroup } from '$lib/server/db/schema';
	import TaskGroupItem from './TaskGroupItem.svelte';

	type SidebarProps = {
		taskGroups: TaskGroup[];
		isSidebarOpen: boolean;
		selectedGroup: string;
		createTaskGroup: () => Promise<void>;
		updateTaskGroup: (taskGroupId: string, updates: Partial<TaskGroup>) => Promise<void>;
		deleteTaskGroup: (taskGroupId: string) => Promise<void>;
	};

	let {
		taskGroups = $bindable(),
		isSidebarOpen = $bindable(),
		selectedGroup = $bindable(),
		createTaskGroup,
		updateTaskGroup,
		deleteTaskGroup
	}: SidebarProps = $props();
	let innerWidth = $state(0);
	let isMobile = $derived(innerWidth < 768);

	let today = DateTime.now();
	let formattedDate = today.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

	const defaultGroups = {
		'My Day': ListIcon,
		Today: Calendar1Icon,
		Tomorrow: CalendarPlusIcon,
		Important: StarIcon
	};

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	function closeMobileSidebar() {
		if (isMobile) isSidebarOpen = false;
	}
</script>

<svelte:window bind:innerWidth />

{#if isMobile && isSidebarOpen}
	<button
		class="fixed inset-0 z-40 bg-black opacity-50"
		onclick={closeMobileSidebar}
		aria-label="close"
	></button>
{/if}

<div
	class={[
		'flex h-screen flex-col bg-white text-neutral-800 transition-all duration-150 dark:bg-neutral-900 dark:text-neutral-200',
		isMobile && 'fixed top-0 left-0 z-50 w-64 transform shadow-lg',
		isMobile && (isSidebarOpen ? 'translate-x-0' : '-translate-x-full'),
		!isMobile && 'md:static md:flex md:h-screen',
		!isMobile && (isSidebarOpen ? 'md:w-64' : 'md:w-16')
	]}
>
	<section
		class="
		flex h-full w-full flex-col
		bg-neutral-50 text-neutral-900
		transition-colors duration-300
		dark:bg-neutral-900 dark:text-neutral-100
	"
	>
		<div class="flex w-full items-center">
			{#if isSidebarOpen}
				<div
					class="overflow-hidden px-4 py-3 font-bold text-nowrap text-ellipsis whitespace-nowrap"
				>
					{formattedDate}
				</div>
			{/if}

			{#if !isMobile}
				<button
					aria-label="Toggle Sidebar"
					class="m-2 cursor-pointer rounded p-2 text-right text-neutral-800 dark:text-white {isSidebarOpen
						? 'ml-auto'
						: 'mx-auto'}"
					onclick={toggleSidebar}
				>
					<ChevronRightIcon class="transition-all {isSidebarOpen ? 'rotate-180' : ''}" />
				</button>
			{/if}
		</div>

		<ul class="flex flex-col gap-1">
			{#each Object.entries(defaultGroups) as [group, Icon]}
				<li class="mr-4">
					<button
						type="button"
						onclick={() => (selectedGroup = group)}
						class="
          flex w-full items-center
          justify-start
          rounded-md px-4 py-2
          text-sm font-medium
          transition-all duration-150
          hover:bg-neutral-200 dark:hover:bg-neutral-800
          {selectedGroup === group
							? 'bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-white'
							: 'text-neutral-700 dark:text-neutral-300'}
          {!isSidebarOpen ? 'h-10 w-10 justify-center p-0' : 'w-auto'}
          mx-2
        "
					>
						{#if isSidebarOpen}
							<span class="truncate">{group}</span>
						{:else}
							<Icon class="size-4" />
						{/if}
					</button>
				</li>
			{/each}
		</ul>

		<hr class="my-3 border-t border-neutral-200 dark:border-neutral-800" />

		<div
			class="
			flex px-4 py-2 {isSidebarOpen ? 'justify-between' : 'justify-around'}
			  text-neutral-800 dark:text-white
		"
		>
			{#if isSidebarOpen}
				<span>Your Lists</span>
			{/if}

			<button
				aria-label="Add List"
				type="submit"
				onclick={createTaskGroup}
				class="cursor-pointer text-neutral-800 dark:text-white"
			>
				<PlusIcon />
			</button>
		</div>
		<ScrollArea.Root
			class="
		relative max-h-[calc(100vh-100px)] overflow-hidden rounded-xl
		bg-neutral-50 duration-200 dark:bg-neutral-900
	"
		>
			<ScrollArea.Viewport class="h-full w-full">
				<ul class="flex flex-col gap-1 p-2">
					{#each taskGroups as group, i (group.id)}
						<TaskGroupItem
							{isSidebarOpen}
							{updateTaskGroup}
							{deleteTaskGroup}
							bind:selectedGroup
							bind:group={taskGroups[i]}
						/>
					{/each}
				</ul>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				orientation="vertical"
				class="
			group flex w-2 touch-none rounded-full bg-transparent
			transition-all duration-200 select-none
			hover:w-2.5
		"
			>
				<ScrollArea.Thumb
					class="
				flex-1 rounded-full bg-neutral-400/50 transition-colors
				group-hover:bg-neutral-400 dark:bg-neutral-600/50
				dark:group-hover:bg-neutral-500
			"
				/>
			</ScrollArea.Scrollbar>

			<ScrollArea.Corner />
		</ScrollArea.Root>
	</section>
</div>
