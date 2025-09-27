<script lang="ts">
	import type { Task } from '$lib/server/db/schema';
	import TaskCheck from './TaskCheck.svelte';

	export let task: Task;
</script>

<div class="flex items-center gap-2">
	<TaskCheck checked={task.isCompleted} /> <span>{task.content}</span>
</div>
