<script lang="ts">
	import TaskInput from '$lib/ui/task/task-input/TaskInput.svelte';
	import TaskComponent from '$lib/ui/task/Task.svelte';
	import Sidebar from '$lib/ui/sidebar/Sidebar.svelte';
	import { CircleCheckBigIcon, MenuIcon, ChevronDown } from '@lucide/svelte';
	import { getTasks, setTasks, moveTask } from '$lib/states/task.state.svelte.js';
	import { getTaskGroups, setTaskGroups } from '$lib/states/taskGroup.state.svelte.js';
	import type { Task, TaskGroup } from '$lib/server/db/schema';
	import SubscriptionsDialog from '$lib/ui/SubscriptionsDialog.svelte';
	import {
		createTaskGroupFetch,
		deleteTaskGroupFetch,
		updateTaskGroupFetch
	} from '$lib/services/taskgroups.service.js';
	import {
		createTaskFetch,
		updateTaskFetch,
		getTasksFetch,
		orderTaskFetch
	} from '$lib/services/tasks.service.js';
	import { wsService } from '$lib/services/ws.service.js';
	import DetailedTaskView from '$lib/ui/DetailedTaskView.svelte';
	import {
		decrementCompletedCount,
		getTotalCompletedCount,
		incrementCompletedCount,
		setTotalCompletedCount
	} from '$lib/states/completedCount.state.svelte.js';
	import Profile from '$lib/ui/Profile.svelte';
	import { PostHog } from '$lib/services/posthog.service';
	import { invalidate } from '$app/navigation';

	let { data } = $props();
	let newTaskContent = $state('');
	let tasks = $derived(getTasks());

	let taskGroups = $derived(getTaskGroups());
	let isSidebarOpen = $state(false);
	let selectedGroup = $state('Tasks');
	let selectedTaskId = $state<string | null>(null);
	let selectedTask = $derived(tasks.find((t) => t.id === selectedTaskId) ?? null);

	let completedTasksLimit = $state(0);
	let hasMoreCompletedTasks = $state((data.completedTasksCount ?? 0) !== 0);
	let totalCompletedCount = $derived(getTotalCompletedCount());

	let draggedTaskId = $state<string | null>(null);
	let taskList = $state<HTMLDivElement | null>(null);

	const COMPLETED_TASKS_PAGE_SIZE = 50;

	wsService.setShouldReconnect(true);
	wsService.connect();

	PostHog.identify(data.user?.id ?? 'guest', { email: data.user?.email ?? '' });

	setTasks(data.tasks);
	setTotalCompletedCount(data.completedTasksCount ?? 0);
	setTaskGroups(data.taskGroups);

	const filterTasksByGroup = (group: string) => {
		switch (group) {
			case 'Tasks':
				return tasks;
			case 'Planned':
				return tasks.filter((t) => t.dueDate !== null && !t.completedAt);
			case 'Important':
				return tasks.filter((t) => t.isImportant && !t.completedAt);
			default:
				return tasks.filter((t) => t.taskGroupId === group && !t.completedAt);
		}
	};

	const loadMoreTasks = async () => {
		if (!hasMoreCompletedTasks) return;

		completedTasksLimit += COMPLETED_TASKS_PAGE_SIZE;

		const response = await getTasksFetch(completedTasksLimit);

		if (response && response.tasks.length > 0) {
			setTasks(response.tasks);
			hasMoreCompletedTasks = response.hasMoreCompletedTasks;
			completedTasksLimit = response.tasks.filter((t) => t.completedAt).length;
		}
	};

	const createTask = async (task: Partial<Task>) => {
		if (newTaskContent.trim() === '') {
			return;
		}

		const success = await createTaskFetch(task);

		if (success) {
			newTaskContent = '';
		}
	};

	const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
		await updateTaskFetch(taskId, updatedTask);

		if (updatedTask.completedAt === undefined) return;

		if (updatedTask.completedAt) incrementCompletedCount();
		else decrementCompletedCount();
	};

	const createTaskGroup = async () => {
		await createTaskGroupFetch();
	};

	const updateTaskGroup = async (taskGroupId: string, updatedTaskGroup: Partial<TaskGroup>) => {
		await updateTaskGroupFetch(taskGroupId, updatedTaskGroup);
	};

	const deleteTaskGroup = async (taskGroupId: string) => {
		if (taskGroupId === selectedGroup) {
			selectedGroup = 'Tasks';
		}

		await deleteTaskGroupFetch(taskGroupId);
	};

	const orderTask = async (taskId: string) => {
		const active = tasks.filter((t) => !t.completedAt);

		const index = active.findIndex((t) => t.id === taskId);

		const left = active[index - 1] ?? null;
		const right = active[index + 1] ?? null;
		const leftId = left ? left.id : null;
		const rightId = right ? right.id : null;

		const ok = await orderTaskFetch(taskId, leftId, rightId);

		if (!ok) {
			invalidate('/home');
		}
	};

	const onDragOver = (e: DragEvent) => {
		e.preventDefault();
		const target = (e.target as HTMLElement).closest('.taskItem');
		if (target && draggedTaskId && taskList && target.id !== draggedTaskId) {
			const boundingBox = target.getBoundingClientRect();
			const offset = boundingBox.y + boundingBox.height / 2;
			const activeTasks = tasks.filter((t) => !t.completedAt).length;
			const targetId =
				e.clientY > offset ? (target.nextElementSibling as HTMLElement | null)?.id : target.id;

			const targetIndex = tasks.findIndex((t) => t.id === targetId);
			if (targetIndex !== -1 && targetIndex < activeTasks) {
				moveTask(draggedTaskId, targetIndex);
			}
		}
	};
</script>

<div class="height-control flex dark:bg-black dark:text-white">
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

			<div class="flex items-center gap-3">
				<span
					class="flex h-10 items-center gap-2 rounded-md border-2 border-neutral-200/50
		bg-neutral-50 px-4 text-sm font-semibold
		text-neutral-800 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-100
		"
				>
					<CircleCheckBigIcon size="16" class="text-neutral-700 dark:text-neutral-300" />
					{totalCompletedCount}
				</span>

				<Profile
					userNameFirstLetter={data.user ? data.user.email.charAt(0).toUpperCase() : ''}
					userEmail={data.user ? data.user.email : ''}
				/>
			</div>
		</div>

		<div
			class="flex grow flex-col gap-2 overflow-x-hidden overflow-y-auto p-2"
			ondragover={onDragOver}
			role="figure"
			id="taskList"
			bind:this={taskList}
		>
			{#each filterTasksByGroup(selectedGroup) as task (task.id)}
				<TaskComponent
					{task}
					{taskGroups}
					{updateTask}
					{orderTask}
					bind:draggedTaskId
					bind:selectedTaskId
				/>
			{/each}

			{#if filterTasksByGroup(selectedGroup).length === 0}
				<div
					class="flex grow flex-col items-center justify-center text-gray-200 dark:text-neutral-950"
				>
					<CircleCheckBigIcon size="300" />
				</div>
			{/if}

			{#if hasMoreCompletedTasks && selectedGroup === 'Tasks'}
				<button
					class="mt-4 flex w-full cursor-pointer justify-center bg-transparent py-6 text-neutral-400 transition
				select-none hover:bg-neutral-50 dark:text-neutral-500 dark:hover:bg-neutral-950"
					onclick={loadMoreTasks}
				>
					<ChevronDown class="text-black dark:text-white/60" />
				</button>
			{/if}
		</div>

		<div class="p-1 sm:p-4">
			<TaskInput onEnter={createTask} bind:newTaskContent {taskGroups} />
		</div>
	</div>

	<DetailedTaskView bind:selectedTask bind:selectedTaskId {taskGroups} {updateTask} />
</div>
