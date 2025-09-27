<script lang="ts">
	import Input from '$lib/ui/Input.svelte';
	import Task from '$lib/ui/task/Task.svelte';
	import type { PageServerData } from './$types';

	let { data } = $props();

	const createTask = async (content: string) => {
		const result = await fetch('/api/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		});

		if (result.ok) {
			const newTask = await result.json();

			const tasks = [...data.tasks, newTask];

			data = { ...data, tasks };
		}
	};
</script>

<h1>task list</h1>

<a href="/">Sales</a>

<div class="p-4">
	{#each data.tasks as task (task.id)}
		<div class="mb-2 rounded-xl border-1 p-4"><Task {task} /></div>
	{/each}
</div>

<Input onEnter={createTask} />
