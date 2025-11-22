<script lang="ts">
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import { vibrate } from '$lib/utils/vibrate';
	import TaskCheck from './TaskCheck.svelte';

	type Props = {
		task: Task;
		taskGroups: TaskGroup[];
		updateTask?: (taskId: string, updates: Partial<Task>) => void;
	};

	let { task, taskGroups, updateTask = () => {} }: Props = $props();

	let taskGroup = $derived(taskGroups.find((group) => group.id === task.taskGroupId) ?? null);

	function toggleChecked(checked: boolean) {
		if (checked) {
			vibrate(50);
		}

		updateTask(task.id, { completedAt: checked ? new Date() : null });
	}
</script>

<div class="flex items-center gap-2">
	<TaskCheck checked={!!task.completedAt} {toggleChecked} />
	<div class="flex flex-col">
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

		<div class="flex">
			{#if task.taskGroupId}
				<div class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-full" style={`background-color: ${taskGroup?.color}`}></span>
					<span class="text-xs">{taskGroup?.name}</span>
				</div>
			{:else}
				<span class="text-xs">Tasks</span>
			{/if}
			{#if task.dueDate}
				<span class="mx-1 text-xs">•</span>
				<span class="text-xs">
					{new Date(task.dueDate).toLocaleDateString(undefined, {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
					})}
				</span>
			{/if}
		</div>
	</div>
</div>
