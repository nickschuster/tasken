<script lang="ts">
	import { Trash2Icon, TextCursorInput } from '@lucide/svelte';
	import type { TaskGroup } from '$lib/server/db/schema';
	import DropdownMenu from '../GroupContextMenu.svelte';

	type TaskGroupItemProps = {
		group: TaskGroup;
		isSidebarOpen: boolean;
		selectedGroup: string;
		updateTaskGroup: (taskGroupId: string, updates: Partial<TaskGroup>) => Promise<void>;
		deleteTaskGroup: (taskGroupId: string) => Promise<void>;
	};

	let {
		group = $bindable(),
		isSidebarOpen,
		updateTaskGroup,
		deleteTaskGroup,
		selectedGroup = $bindable()
	}: TaskGroupItemProps = $props();

	let isEditing = $state(false);
	let newName = $state(group.name);
	let renameInput = $state<HTMLInputElement | undefined>();

	$effect(() => {
		if (isEditing && renameInput) {
			renameInput.focus();
		}
	});

	function startEditing() {
		isEditing = true;
	}

	function stopEditing() {
		isEditing = false;
	}
</script>

<button
	class={[
		'flex cursor-pointer items-center gap-2 rounded-md  transition-colors duration-150',
		'hover:bg-neutral-200 dark:hover:bg-neutral-800',
		'text-neutral-800 dark:text-neutral-200',
		selectedGroup === group.id &&
			'bg-neutral-300 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-white',
		!isSidebarOpen && 'justify-center py-3',
		isSidebarOpen && 'pl-2'
	]}
	onclick={() => (selectedGroup = group.id)}
>
	<input type="hidden" name="groupId" value={group.id} />

	{#if isSidebarOpen}
		{#if !isEditing}
			<div class="flex w-full flex-row items-center justify-between">
				<div class="truncate text-sm font-medium">{group.name}</div>

				<div class="flex flex-row items-center gap-3">
					<input
						type="color"
						id="color-picker"
						class="size-3 cursor-pointer rounded-full border-none"
						style="background-color: {group.color}"
						onchange={(e) => {
							updateTaskGroup(group.id, { color: e.currentTarget.value });
						}}
						bind:value={group.color}
					/>

					<DropdownMenu
						buttonText="⋯"
						items={[
							{
								name: 'Rename',
								id: 'rename',
								icon: TextCursorInput,
								action: () => startEditing()
							},
							{
								name: 'Delete',
								id: 'delete',
								icon: Trash2Icon,
								action: () => deleteTaskGroup(group.id)
							}
						]}
					/>
				</div>
			</div>
		{:else}
			<input
				bind:value={newName}
				bind:this={renameInput}
				name="groupName"
				type="text"
				class="
					flex-1 rounded border-neutral-300
					bg-transparent py-2 text-sm
					font-medium text-neutral-800 outline-none
					focus:border-neutral-500 dark:border-neutral-700
					dark:text-neutral-100 dark:focus:border-neutral-400
				"
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						updateTaskGroup(group.id, { name: newName });
						stopEditing();
					} else if (e.key === 'Escape') {
						stopEditing();
					}
				}}
				onblur={() => {
					updateTaskGroup(group.id, { name: newName });
					stopEditing();
				}}
			/>
		{/if}
	{:else}
		<div class="size-3 rounded-full" style="background-color: {group.color}"></div>
	{/if}
</button>
