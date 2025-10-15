<script lang="ts">
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import { vibrate } from '$lib/utils/vibrate';
	import TaskCheck from './TaskCheck.svelte';
	import DropdownMenu from '../DropdownMenu.svelte';
	import { FlagIcon } from '@lucide/svelte';

	export let task: Task;
	export let updateTask: (taskId: string, updates: Partial<Task>) => void = () => {};
	export let taskGroups: TaskGroup[];

	function toggleChecked(checked: boolean) {
		if (checked) {
			vibrate(50);
		}

		updateTask(task.id, { completedAt: checked ? new Date() : null });
	}
</script>

<div class="flex items-center gap-2">
	<TaskCheck checked={!!task.completedAt} {toggleChecked} />
	{#if !!task.completedAt}
		<span class="line-through">{task.content}</span>
	{:else}
		<input
			bind:value={task.content}
			type="text"
			class="w-full outline-none"
			onchange={() => updateTask(task.id, { content: task.content })}
			onkeypress={(e) => e.stopPropagation()}
			onclick={(e) => e.stopPropagation()}
		/>
	{/if}
	<FlagIcon
		class={task.isImportant ? 'bg-red-700' : 'bg-white'}
		onclick={() => updateTask(task.id, { isImportant: !task.isImportant })}
	/>
	<DropdownMenu
		buttonText="Add to group"
		items={taskGroups}
		onSelect={(group) => updateTask(task.id, { taskGroupId: group.id })}
	/>
</div>
