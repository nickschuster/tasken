<script lang="ts">
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import { vibrate } from '$lib/utils/vibrate';
	import TaskCheck from './TaskCheck.svelte';

	type Props = {
		task: Task;
		updateTask: (taskId: string, updates: Partial<Task>) => void;
	};

	let { task, updateTask }: Props = $props();

	function toggleChecked(checked: boolean) {
		if (checked) {
			vibrate(50);
		}

		updateTask(task.id, { completedAt: checked ? new Date() : null });
	}
</script>

<div class="flex items-center gap-2">
	<TaskCheck checked={!!task.completedAt} {toggleChecked} {task} />
	{#if !!task.completedAt}
		<span class="line-through">{task.content}</span>
	{:else}
		<span>{task.content}</span>
	{/if}
</div>
