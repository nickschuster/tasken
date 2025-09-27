<script lang="ts">
	import Input from '$lib/ui/Input.svelte';
	import Task from '$lib/ui/task/Task.svelte';
	import { index } from 'drizzle-orm/gel-core';

	let { data } = $props();
	let newTaskContent = $state('');

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

			newTaskContent = '';
		}
	};

	const updateTask = async (taskId: string, updates: Partial<Task>) => {
		const currentTask = data.tasks.find((task) => task.id === taskId);

		const tasks = data.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task));

		data = { ...data, tasks };

		const result = await fetch(`/api/tasks/${taskId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updates)
		});

		if (!result.ok && currentTask) {
			data = {
				...data,
				tasks: data.tasks.map((task) => (task.id === taskId ? currentTask : task))
			};
		}
	};
</script>

<h1>task list</h1>

<a href="/">Sales</a>

<div class="flex flex-col gap-2 p-4">
	{#each data.tasks as task, i (task.id)}
		<div
			class="rounded-lg p-4 transition-all duration-200
            {task.isCompleted ? 'scale-99' : 'shadow-sm ease-out hover:shadow-md'}"
		>
			<Task {task} {updateTask} />
		</div>
	{/each}
</div>

<Input onEnter={createTask} bind:newTaskContent />
