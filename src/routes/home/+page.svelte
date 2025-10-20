<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Input from '$lib/ui/Input.svelte';
	import TaskComponent from '$lib/ui/task/Task.svelte';
	import Collapsible from '$lib/ui/Collapsible.svelte';
	import Sidebar from '$lib/ui/sidebar/Sidebar.svelte';
	import { CircleCheckBigIcon, MenuIcon } from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { addTask, getTasks, setTasks, updateTask } from '$lib/states/task.state.svelte.js';
	import { getTaskGroups, setTaskGroups } from '$lib/states/taskGroup.state.svelte.js';
	import { wsService } from '$lib/services/ws.service.js';
	import { Event } from '$lib/models/event.js';
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import {
		createTaskGroupFetch,
		deleteTaskGroupFetch,
		updateTaskGroupFetch
	} from '$lib/services/taskgroups.service.js';

	let { data } = $props();
	let newTaskContent = $state('');
	let today = DateTime.now().toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
	let tasks = $derived(getTasks());
	let taskGroups = $derived(getTaskGroups());
	let isSidebarOpen = $state(false);
	let selectedGroup = $state('All');

	setTasks(data.tasks);
	setTaskGroups(data.taskGroups);

	const filterTasksByGroup = (group: string) => {
		const today = new Date();
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		switch (group) {
			case 'All':
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

		return (
			dateA.getFullYear() === dateB.getFullYear() &&
			dateA.getMonth() === dateB.getMonth() &&
			dateA.getDate() === dateB.getDate()
		);
	};

	const createTaskFetch = async (content: string) => {
		const result = await fetch('/api/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		});

		if (result.ok) {
			const newTask = await result.json();

			addTask(newTask);

			wsService.sendMessage(Event.TaskAdded, newTask);

			newTaskContent = '';
		}

		await invalidate('/home');
	};

	const updateTaskFetch = async (taskId: string, updates: Partial<Task>) => {
		const currentTask = tasks.find((task) => task.id === taskId);

		updateTask(taskId, updates);

		const result = await fetch(`/api/tasks/${taskId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updates)
		});

		if (!result.ok && currentTask) {
			updateTask(taskId, currentTask);
		} else {
			wsService.sendMessage(Event.TaskUpdated, { ...currentTask, ...updates });
		}

		await invalidate('/home');
	};

	const createTaskGroup = async () => {
		await createTaskGroupFetch();
	};

	const updateTaskGroup = async (taskGroupId: string, updatedTaskGroup: Partial<TaskGroup>) => {
		await updateTaskGroupFetch(taskGroupId, updatedTaskGroup);
	};

	const deleteTaskGroup = async (taskGroupId: string) => {
		if (taskGroupId === selectedGroup) {
			selectedGroup = 'All';
		}

		await deleteTaskGroupFetch(taskGroupId);
	};
</script>

<div class="flex h-screen dark:bg-black dark:text-white">
	<Sidebar
		bind:isSidebarOpen
		bind:selectedGroup
		{taskGroups}
		{createTaskGroup}
		{updateTaskGroup}
		{deleteTaskGroup}
	/>

	<div class="flex flex-1 flex-col">
		<div class="flex w-full justify-between">
			<div class="flex flex-row px-2 pt-2 text-3xl">
				<button
					class="cursor-pointer rounded bg-white p-2 hover:text-neutral-300 md:hidden dark:bg-black dark:text-white hover:dark:text-neutral-500"
					onclick={() => (isSidebarOpen = true)}
				>
					<MenuIcon />
				</button>
				<h2 class="px-2 pt-2 text-3xl">
					{taskGroups.find((g) => g.id === selectedGroup)?.name ?? selectedGroup}
				</h2>
			</div>
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

		<div class="flex grow flex-col gap-2 overflow-x-hidden overflow-y-auto p-2">
			{#each filterTasksByGroup(selectedGroup).filter((task) => !task.completedAt) as task, i (task.id)}
				<div
					class="rounded-lg p-4 transition-all duration-200
			{task.completedAt ? '' : 'hover:bg-neutral-100'}"
				>
					<TaskComponent {task} updateTask={updateTaskFetch} />
				</div>
			{/each}

			{#if tasks.length === 0}
				<div
					class="flex grow flex-col items-center justify-center text-gray-200 dark:text-neutral-950"
				>
					<CircleCheckBigIcon size="300" />
				</div>
			{/if}

			{#if filterTasksByGroup(selectedGroup).some((task) => task.completedAt)}
				<Collapsible headerText="Completed">
					{#each filterTasksByGroup(selectedGroup).filter((task) => task.completedAt) as task, i (task.id)}
						<div class="rounded-lg p-4">
							<TaskComponent {task} updateTask={updateTaskFetch} />
						</div>
					{/each}
				</Collapsible>
			{/if}
		</div>

		<div class="p-4">
			<Input onEnter={createTaskFetch} bind:newTaskContent />
		</div>
	</div>
</div>
