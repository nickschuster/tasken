<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Input from '$lib/ui/Input.svelte';
	import Task from '$lib/ui/task/Task.svelte';
	import Collapsible from '$lib/ui/Collapsible.svelte';
	import { CircleCheckBigIcon } from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let newTaskContent = $state('');
	let today = DateTime.now().toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

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

		await invalidate('/home');
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

		await invalidate('/home');
	};
</script>

<div class="flex h-screen flex-col dark:bg-black dark:text-white">
	<div class="px-4 pt-4 text-5xl">My Day</div>
	<div class="px-4">{today}</div>

	<div class="flex grow flex-col gap-2 overflow-x-hidden overflow-y-auto p-2">
		{#each data.tasks.filter((task) => !task.isCompleted) as task, i (task.id)}
			<div
				out:fly={{ y: 0, x: 150, duration: 250 }}
				class="rounded-lg p-4 transition-all duration-200
			{task.isCompleted
					? 'scale-99'
					: 'shadow-xs ease-out hover:shadow-md dark:shadow-neutral-900 dark:hover:shadow-md'}"
			>
				<Task {task} {updateTask} />
			</div>
		{/each}

		{#if data.tasks.length === 0}
			<div
				class="flex grow flex-col items-center justify-center text-gray-200 dark:text-neutral-950"
			>
				<CircleCheckBigIcon size="300" />
			</div>
		{/if}

		{#if data.tasks.some((task) => task.isCompleted)}
			<Collapsible headerText="Completed">
				{#each data.tasks.filter((task) => task.isCompleted) as task, i (task.id)}
					<div class="scale-99 rounded-lg p-4">
						<Task {task} {updateTask} />
					</div>
				{/each}
			</Collapsible>
		{/if}
	</div>

	<div class="p-4">
		<Input onEnter={createTask} bind:newTaskContent />
	</div>
</div>
