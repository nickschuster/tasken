<script lang="ts">
	import { HomeIcon } from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { enhance } from '$app/forms';
	import TaskGroupItem from './TaskGroupItem.svelte';

	let { taskGroups, isOpen = $bindable(), selectedGroup = $bindable() } = $props();
	let isCollapsed = $state(false);
	let innerWidth = $state(0);
	let isMobile = $derived(innerWidth < 768);
	let today = DateTime.now().toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

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
	<div class="fixed inset-0 z-40 bg-black/50" onclick={closeMobileSidebar}></div>
{/if}

<div
	class={`flex h-screen flex-col bg-gray-400 transition-all duration-300
		${
			isMobile
				? `fixed top-0 left-0 z-50 w-64 transform shadow-lg ${
						isOpen ? 'translate-x-0' : '-translate-x-full'
					}`
				: `md:static md:flex md:h-screen ${isCollapsed ? 'md:w-16' : 'md:w-64'}`
		}`}
>
	<button class="m-2 rounded bg-neutral-800 p-2 text-white" onclick={toggleSidebar}>
		{isMobile ? '☰' : isCollapsed ? '›' : '‹'}
	</button>

	<h2 class="p-4">
		{#if !isCollapsed}{today}{:else}<HomeIcon />{/if}
	</h2>

	<hr />

	<ul class="space-y-2 p-4 px-2">
		<li
			class="flex items-center gap-2 p-4"
			class:bg-yellow-100={selectedGroup === 'today'}
			onclick={() => (selectedGroup = 'today')}
		>
			<span>G</span>
			{#if !isCollapsed}<span>Today</span>{/if}
		</li>
		<li class="flex items-center gap-2 p-4">
			<span>T</span>
			{#if !isCollapsed}<span>Tommorrow</span>{/if}
		</li>
		<li
			class="flex items-center gap-2 p-4"
			class:bg-yellow-100={selectedGroup === 'important'}
			onclick={() => {
				console.log('clicked important');
				selectedGroup = 'important';
			}}
		>
			<span>I</span>
			{#if !isCollapsed}<span>Important</span>{/if}
		</li>
	</ul>

	<h2 class="p-4">
		{#if !isCollapsed}Custom Groups{:else}<HomeIcon />{/if}
	</h2>
	<form method="POST" action="?/createTaskGroup" use:enhance>
		<button type="submit" class="cursor-pointer bg-amber-200 p-4">Create Group +</button>
	</form>
	<hr />
	<ul class="space-y-2 p-4 px-2">
		{#each taskGroups as group, i (group.id)}
			<TaskGroupItem {group} {isCollapsed} />
		{/each}
	</ul>
</div>
