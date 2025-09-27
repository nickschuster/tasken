<script lang="ts">
	import type { Task } from '$lib/server/db/schema';
	import TaskCheck from './TaskCheck.svelte';

	export let task: Task;
	export let updateTask: (taskId: string, updates: Partial<Task>) => void = () => {};
</script>

<div class="flex items-center gap-2">
	<TaskCheck
		checked={task.isCompleted}
		toggleChecked={(checked) => updateTask(task.id, { isCompleted: checked })}
	/> <input bind:value={task.content} type="text" />
</div>
