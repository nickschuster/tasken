<script lang="ts">
	import Input from '$lib/ui/Input.svelte';
	import TaskComponent from '$lib/ui/task/Task.svelte';
	import Collapsible from '$lib/ui/Collapsible.svelte';
	import Sidebar from '$lib/ui/sidebar/Sidebar.svelte';
	import { CircleCheckBigIcon, MenuIcon, ChevronDown } from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { getTasks, setTasks } from '$lib/states/task.state.svelte.js';
	import { getTaskGroups, setTaskGroups } from '$lib/states/taskGroup.state.svelte.js';
	import { wsService } from '$lib/services/ws.service.js';
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import SubscriptionsDialog from '$lib/ui/SubscriptionsDialog.svelte';
	import {
		createTaskGroupFetch,
		deleteTaskGroupFetch,
		updateTaskGroupFetch
	} from '$lib/services/taskgroups.service.js';
	import { createTaskFetch, updateTaskFetch, getTasksFetch } from '$lib/services/tasks.service.js';
	import DetailedTaskView from '$lib/ui/DetailedTaskView.svelte';

	let { data } = $props();
	let newTaskContent = $state('');
	let tasks = $derived(getTasks());
	let taskGroups = $derived(getTaskGroups());
	let isSidebarOpen = $state(false);
	let selectedGroup = $state('My Day');
	let selectedTaskId = $state<string | null>(null);
	let selectedTask = $derived(tasks.find((t) => t.id === selectedTaskId) ?? null);
	let limit = $derived(tasks.length);
	let hasMoreTasks = $state(data.hasMoreTasks);
	let completedTasksCount = $state(data.completedTasksCount[0].count ?? 0);

	wsService.setShouldReconnect(true);
	wsService.connect();

	setTasks(data.tasks);
	setTaskGroups(data.taskGroups);

	const filterTasksByGroup = (group: string) => {
		const today = new Date();
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		switch (group) {
			case 'My Day':
				return tasks;
			case 'Today':
				return tasks.filter((t) => isSameDay(t.dueDate, today));
			case 'Tomorrow':
				return tasks.filter((t) => isSameDay(t.dueDate, tomorrow));
			case 'Important':
				return tasks.filter((t) => t.isImportant);
			default:
				return tasks.filter((t) => t.taskGroupId === group);
		}
	};

	const isSameDay = (dateA: Date | null, dateB: Date) => {
		if (!dateA) {
			return false;
		}

		if (typeof dateA === 'string') {
			dateA = new Date(dateA);
		}

		return (
			dateA.getFullYear() === dateB.getFullYear() &&
			dateA.getMonth() === dateB.getMonth() &&
			dateA.getDate() === dateB.getDate()
		);
	};

	const orderTasks = (tasks: Task[]) => {
		return tasks.sort((a, b) => {
			return (
				(b.completedAt ? new Date(b.completedAt).getTime() : Date.now()) -
				(a.completedAt ? new Date(a.completedAt).getTime() : Date.now())
			);
		});
	};

	const handleLogout = (_event: SubmitEvent) => {
		wsService.setShouldReconnect(false);
	};

	const loadMoreTasks = async () => {
		if (!hasMoreTasks) return;

		limit += 50;

		const response = await getTasksFetch(limit);

		if (response && response.tasks.length > 0) {
			setTasks(orderTasks(response.tasks));
			hasMoreTasks = response.hasMoreTasks;
			limit = response.tasks.length;
		}
	};

	const createTask = async () => {
		const success = await createTaskFetch(newTaskContent);

		if (success) {
			newTaskContent = '';
		}
	};

	const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
		await updateTaskFetch(taskId, updatedTask);

		if (updatedTask.completedAt !== undefined) {
			orderTasks(tasks);

			updatedTask.completedAt ? completedTasksCount++ : completedTasksCount--;
		}
	};

	const createTaskGroup = async () => {
		await createTaskGroupFetch();
	};

	const updateTaskGroup = async (taskGroupId: string, updatedTaskGroup: Partial<TaskGroup>) => {
		await updateTaskGroupFetch(taskGroupId, updatedTaskGroup);
	};

	const deleteTaskGroup = async (taskGroupId: string) => {
		if (taskGroupId === selectedGroup) {
			selectedGroup = 'My Day';
		}

		await deleteTaskGroupFetch(taskGroupId);
	};
</script>

<div class="flex h-screen dark:bg-black dark:text-white">
	<SubscriptionsDialog
		subscriptions={data.subscriptionDetails.subscriptions}
		open={!data.subscriptionDetails.isPremium}
	/>

	<Sidebar
		bind:isSidebarOpen
		bind:selectedGroup
		bind:taskGroups
		{createTaskGroup}
		{updateTaskGroup}
		{deleteTaskGroup}
	/>

	<div class="flex flex-1 flex-col">
		<div class="flex w-full items-center justify-between p-2">
			<div class="flex flex-row gap-2 text-3xl">
				<button
					class="cursor-pointer rounded bg-white p-2 hover:text-neutral-300 md:hidden dark:bg-black dark:text-white hover:dark:text-neutral-500"
					onclick={() => (isSidebarOpen = true)}
				>
					<MenuIcon />
				</button>
				<h2 class="text-3xl">
					{taskGroups.find((g) => g.id === selectedGroup)?.name ?? selectedGroup}
				</h2>
			</div>
			<h1
				class="
		flex items-center gap-2 rounded-md bg-neutral-300
		px-3 py-1.5
		text-sm font-medium text-black
		dark:bg-neutral-900 dark:text-white
	"
			>
				{completedTasksCount} Completed
				<CircleCheckBigIcon size="16" class="text-black dark:text-white" />
			</h1>

			<div class="text-2xl">
				<form method="POST" action="?/logout" onsubmit={handleLogout}>
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

		<div class="flex grow flex-col gap-2 overflow-x-hidden overflow-y-auto p-2">
			{#snippet taskSnippet(task: Task)}
				<div
					tabindex="0"
					role="button"
					onclick={(e) => {
						e.stopPropagation();
						selectedTaskId = task.id;
					}}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							selectedTaskId = task.id;
						}
					}}
					onfocus={() => (selectedTaskId = task.id)}
					class="rounded-lg p-4 transition-all duration-200
			{task.completedAt ? '' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}"
				>
					<TaskComponent {task} {updateTask} />
				</div>
			{/snippet}
			{#each filterTasksByGroup(selectedGroup) as task, i (task.id)}
				{@render taskSnippet(task)}
			{/each}

			{#if tasks.length === 0}
				<div
					class="flex grow flex-col items-center justify-center text-gray-200 dark:text-neutral-950"
				>
					<CircleCheckBigIcon size="300" />
				</div>
			{/if}

			{#if hasMoreTasks}
				<button
					class="
		mt-4 flex w-full
		cursor-pointer justify-center
		bg-transparent py-6
		text-neutral-400 transition
		select-none
		hover:bg-neutral-50 dark:text-neutral-500
		dark:hover:bg-neutral-950
	"
					onclick={loadMoreTasks}
				>
					<ChevronDown class="opacity-50" />
				</button>
			{/if}
		</div>

		<div class="p-4">
			<Input onEnter={createTask} bind:newTaskContent />
		</div>
	</div>

	<DetailedTaskView bind:selectedTask bind:selectedTaskId {taskGroups} {updateTask} />
</div>
