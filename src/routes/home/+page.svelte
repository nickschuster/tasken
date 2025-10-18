<script lang="ts">
	import Input from '$lib/ui/Input.svelte';
	import TaskComponent from '$lib/ui/task/Task.svelte';
	import Collapsible from '$lib/ui/Collapsible.svelte';
	import { CircleCheckBigIcon } from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { getTasks, setTasks } from '$lib/states/task.state.svelte.js';
	import { createTaskFetch, updateTaskFetch } from '$lib/services/tasks.service.js';
	import SubscriptionsDialog from '$lib/ui/SubscriptionsDialog.svelte';
	import { wsService } from '$lib/services/ws.service.js';
	import type { Task } from '$lib/server/db/schema';

	let { data } = $props();
	let newTaskContent = $state('');
	let today = DateTime.now().toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
	let tasks = $derived(getTasks());

	wsService.connect();

	setTasks(data.tasks);

	const createTask = async () => {
		const success = await createTaskFetch(newTaskContent);

		if (success) {
			newTaskContent = '';
		}
	};

	const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
		await updateTaskFetch(taskId, updatedTask);
	};
</script>

<div class="flex h-screen flex-col dark:bg-black dark:text-white">
	<SubscriptionsDialog
		subscriptions={data.subscriptionDetails.subscriptions}
		open={!data.subscriptionDetails.isPremium}
	/>

	<div class="flex w-full justify-between">
		<div class="px-4 pt-4 text-5xl">My Day</div>
		<div class="px-4 pt-4 text-2xl">
			<form method="POST" action="?/logout">
				<button
					type="submit"
					title="logout"
					class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-neutral-300 text-center dark:bg-neutral-900"
				>
					{#if data.user}
						{data.user.email.charAt(0)}
					{/if}
				</button>
			</form>
		</div>
	</div>

	<div class="px-4">{today}</div>

	<div class="flex grow flex-col gap-2 overflow-x-hidden overflow-y-auto p-2">
		{#each tasks.filter((task) => !task.completedAt) as task, i (task.id)}
			<div
				class="rounded-lg p-4 transition-all duration-200
			{task.completedAt ? '' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}"
			>
				<TaskComponent {task} {updateTask} />
			</div>
		{/each}

		{#if tasks.length === 0}
			<div
				class="flex grow flex-col items-center justify-center text-gray-200 dark:text-neutral-950"
			>
				<CircleCheckBigIcon size="300" />
			</div>
		{/if}

		{#if tasks.some((task) => task.completedAt)}
			<Collapsible headerText="Completed">
				{#each tasks.filter((task) => task.completedAt) as task, i (task.id)}
					<div class="rounded-lg p-4">
						<TaskComponent {task} {updateTask} />
					</div>
				{/each}
			</Collapsible>
		{/if}
	</div>

	<div class="p-4">
		<Input onEnter={createTask} bind:newTaskContent />
	</div>
</div>
