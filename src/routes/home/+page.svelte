<script lang="ts">
	import Input from '$lib/ui/Input.svelte';
	import Task from '$lib/ui/task/Task.svelte';

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

<div class="p-4">
	{#each data.tasks as task (task.id)}
		<div class="mb-2 rounded-xl border-1 p-4"><Task {task} {updateTask} /></div>
	{/each}
</div>

<Input onEnter={createTask} bind:newTaskContent />
