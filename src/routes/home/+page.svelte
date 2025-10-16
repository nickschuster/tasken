<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Input from '$lib/ui/Input.svelte';
	import TaskComponent from '$lib/ui/task/Task.svelte';
	import Collapsible from '$lib/ui/Collapsible.svelte';
	import Sidebar from '$lib/ui/sidebar/Sidebar.svelte';
	import { CircleCheckBigIcon } from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { addTask, getTasks, setTasks, updateTask } from '$lib/states/task.state.svelte.js';
	import {
		addTaskGroup,
		getTaskGroups,
		setTaskGroups,
		updateTaskGroup,
		deleteTaskGroup
	} from '$lib/states/taskGroup.state.svelte.js';
	import { wsService } from '$lib/services/ws.service.js';
	import { Event } from '$lib/models/event.js';
	import type { Task, TaskGroup } from '$lib/server/db/schema';

	let { data } = $props();
	let newTaskContent = $state('');
	let today = DateTime.now().toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
	let tasks = $derived(getTasks());
	let taskGroups = $derived(getTaskGroups());
	let mobileSidebarOpen = $state(false);
	let selectedGroup = $state('Today');

	setTasks(data.tasks);
	setTaskGroups(data.taskGroups);

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

	const createTaskGroupFetch = async () => {
		const result = await fetch('/api/task-groups', {
			method: 'POST'
		});

		if (result.ok) {
			const newTaskGroup = await result.json();

			addTaskGroup(newTaskGroup);

			// sync
		}

		await invalidate('/home');
	};

	const updateTaskGroupFetch = async (taskGroupId: string, updates: Partial<TaskGroup>) => {
		const currentTaskGroup = taskGroups.find((taskGroup) => taskGroup.id === taskGroupId);

		updateTaskGroup(taskGroupId, updates);

		const result = await fetch(`/api/task-groups/${taskGroupId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updates)
		});

		if (!result.ok && currentTaskGroup) {
			updateTaskGroup(taskGroupId, currentTaskGroup);
		} else {
			// sync
		}
	};

	const deleteTaskGroupFetch = async (taskGroupId: string) => {
		deleteTaskGroup(taskGroupId);

		const result = await fetch(`/api/task-groups/${taskGroupId}`, {
			method: 'DELETE'
		});

		if (!result.ok) {
			await invalidate('/home');
		}
	};
</script>

<div class="flex h-screen dark:bg-black dark:text-white">
	<Sidebar
		bind:isOpen={mobileSidebarOpen}
		bind:selectedGroup
		{taskGroups}
		createTaskGroup={createTaskGroupFetch}
		updateTaskGroup={updateTaskGroupFetch}
		deleteTaskGroup={deleteTaskGroupFetch}
	/>

	<div class="flex flex-1 flex-col">
		<div class="flex w-full justify-between">
			<div class="px-4 pt-4 text-5xl">
				<button
					class="rounded bg-neutral-800 p-2 md:hidden"
					onclick={() => (mobileSidebarOpen = true)}
				>
					☰
				</button>
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

		<div class="px-4">{today}</div>

		<div class="flex grow flex-col gap-2 overflow-x-hidden overflow-y-auto p-2">
			{#each tasks.filter((task) => {
				if (!task.completedAt) {
					if (selectedGroup === 'important') return task.isImportant;
					return task;
				}
			}) as task, i (task.id)}
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

			{#if tasks.some((task) => task.completedAt)}
				<Collapsible headerText="Completed">
					{#each tasks.filter((task) => task.completedAt) as task, i (task.id)}
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
