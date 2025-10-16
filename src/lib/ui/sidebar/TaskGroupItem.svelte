<script lang="ts">
	import { Trash2Icon, TextCursorInput } from '@lucide/svelte';
	import type { TaskGroup } from '$lib/server/db/schema';
	import DropdownMenu from '../DropdownMenu.svelte';

	type TaskGroupItemProps = {
		group: TaskGroup;
		isCollapsed: boolean;
		updateTaskGroup: (taskGroupId: string, updates: Partial<TaskGroup>) => Promise<void>;
		deleteTaskGroup: (taskGroupId: string) => Promise<void>;
	};

	let { group, isCollapsed, updateTaskGroup, deleteTaskGroup }: TaskGroupItemProps = $props();

	let isEditing = $state(false);
	let newName = $state(group.name);

	function startEditing() {
		isEditing = true;
	}

	function stopEditing() {
		isEditing = false;
	}

	$inspect(group);
</script>

<div class="flex items-center gap-2 rounded p-4 hover:bg-neutral-500">
	<input type="hidden" name="groupId" value={group.id} />

	{#if !isCollapsed}
		{#if !isEditing}
			<div class="flex w-full flex-row items-center justify-between">
				<div class="truncate">{group.name}</div>
				<div class="flex flex-row items-center gap-2">
					<div class="full size-3 rounded" style="background-color: {group.color}"></div>

					<DropdownMenu
						buttonText="..."
						items={[
							{ name: 'Rename', id: '1', icon: TextCursorInput, action: () => startEditing() },
							{
								name: 'Delete',
								id: '2',
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
				name="groupName"
				type="text"
				class="flex-1 rounded bg-transparent outline-none"
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						updateTaskGroup(group.id, { name: newName });
						stopEditing();
					} else if (e.key === 'Escape') {
						stopEditing();
					}
				}}
				onblur={stopEditing}
				autofocus
			/>
		{/if}
	{:else}
		<div class="full size-3 rounded" style="background-color: {group.color}"></div>
	{/if}
</div>
