<script lang="ts">
	import { Check, ChevronDown, StarIcon } from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { Select } from 'bits-ui';
	import { type TaskGroup, type Task } from '$lib/server/db/schema';
	import { getLocalTimeZone, CalendarDate } from '@internationalized/date';
	import DatePicker from '$lib/ui/DatePicker.svelte';

	type Props = {
		selectedTask: Task | null;
		selectedTaskId: string | null;
		taskGroups: TaskGroup[];
		updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
	};

	let {
		selectedTask = $bindable(),
		selectedTaskId = $bindable(),
		taskGroups,
		updateTask
	}: Props = $props();
	let innerWidth = $state(0);
	let isMobile = $derived(innerWidth < 768);
	let isTaskViewOpen = $derived(!!selectedTask);
	let taskViewElement = $state<HTMLElement | null>(null);

	let content = $derived(selectedTask?.content ?? '');
	let taskGroupId = $derived(selectedTask?.taskGroupId ?? '');
	let dueDate = $derived.by(() => {
		const date =
			typeof selectedTask?.dueDate === 'string'
				? new Date(selectedTask.dueDate)
				: selectedTask?.dueDate;

		return date
			? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
			: undefined;
	});

	let groups = $derived(
		taskGroups.map((group) => ({
			label: group.name,
			value: group.id,
			color: group.color
		}))
	);

	let selectedLabel = $derived(
		selectedTask
			? (groups.find((group) => group.value === selectedTask?.taskGroupId)?.label ?? 'No Group')
			: 'No Group'
	);

	const handleContentChange = () => {
		if (selectedTask && content.trim().length > 0) {
			selectedTask = { ...selectedTask, content: content };
			updateTask(selectedTask.id, { content: content });
		} else {
			content = selectedTask?.content ?? '';
		}
	};

	const handleDocumentClick = (e: MouseEvent) => {
		const calendar = (e.target as HTMLElement)?.closest('[data-calendar-grid]');
		const selectMenu = (e.target as HTMLElement)?.closest('[data-bits-select-group]');
		const detailedTaskView = taskViewElement?.contains(e.target as Node);

		if (calendar || selectMenu || detailedTaskView) return;

		if (isTaskViewOpen && taskViewElement) {
			selectedTaskId = null;
		}
	};

	const handleDueDateChange = () => {
		if (dueDate && selectedTask) {
			const newDueDate = dueDate.toDate(getLocalTimeZone());

			selectedTask = { ...selectedTask, dueDate: newDueDate };

			updateTask(selectedTask.id, { dueDate: newDueDate });
		}
	};

	const handleGroupSelection = () => {
		if (!selectedTask) return;

		const updatedTaskGroup = taskGroupId.length === 0 ? null : taskGroupId;

		selectedTask = { ...selectedTask, taskGroupId: updatedTaskGroup };

		updateTask(selectedTask.id, { taskGroupId: updatedTaskGroup });
	};

	const handleIsImportantToggle = () => {
		if (!selectedTask) return;

		const prev = { ...selectedTask };

		selectedTask = { ...prev, isImportant: !prev.isImportant };

		updateTask(selectedTask.id, { isImportant: selectedTask.isImportant });
	};
</script>

<svelte:window bind:innerWidth onclick={handleDocumentClick} />

<div
	class={[
		'flex h-screen flex-col bg-white text-neutral-800 transition-all duration-150 dark:bg-neutral-950 dark:text-neutral-200',
		isMobile && 'fixed top-0 right-0 z-50 w-96 transform shadow-lg',
		isMobile && (isTaskViewOpen ? 'translate-x-0' : 'translate-x-full'),
		!isMobile && 'md:static md:flex md:h-screen',
		!isMobile && (isTaskViewOpen ? 'md:w-96' : 'md:w-0')
	]}
	bind:this={taskViewElement}
>
	<section
		class="
		flex h-full w-full flex-col
		bg-neutral-50 p-4
		text-neutral-900 transition-colors
		duration-300 dark:bg-neutral-950
    dark:text-neutral-100
	"
	>
		{#if selectedTaskId && selectedTask}
			<div class="flex flex-row justify-between">
				<h1 class="font-bold">Task Details</h1>
				<p
					class="rounded-4xl border-1 px-2 py-1 text-xs {!!selectedTask.completedAt
						? 'border-green-600 bg-green-700 text-green-300'
						: 'border-blue-600 bg-blue-700 text-blue-300'}"
				>
					{!!selectedTask.completedAt ? 'Completed' : 'Active'}
				</p>
			</div>
			<p class="pb-8 text-sm font-medium text-neutral-500">
				{DateTime.fromJSDate(
					typeof selectedTask.createdAt === 'string'
						? new Date(selectedTask.createdAt)
						: selectedTask.createdAt
				).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
			</p>
			<div class="flex flex-col gap-6">
				<div
					class="rounded-md border-2 border-neutral-200/50 bg-neutral-50 p-3 dark:border-neutral-900 dark:bg-neutral-950"
				>
					<h2 class="pb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
						Primary Information
					</h2>
					<p class="py-1 text-xs font-medium text-neutral-500">TASK NAME</p>
					<div class="flex flex-row items-center gap-1">
						<input
							type="text"
							class="text-md w-full rounded-lg border border-neutral-300 bg-white px-4
      py-1 text-neutral-700 transition-all
      duration-200 ease-in-out placeholder:text-neutral-400
      hover:border-neutral-400 focus:border-transparent focus:ring-2 focus:ring-black
      focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300
      dark:placeholder:text-neutral-500 dark:focus:ring-white"
							bind:value={content}
							placeholder="Task Name"
							onblur={handleContentChange}
							onkeydown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleContentChange();
									(e.target as HTMLInputElement).blur();
								}
							}}
						/>
						<button
							type="button"
							tabindex="0"
							aria-label="Is Important Toggle"
							onclick={handleIsImportantToggle}
							class="flex items-center justify-center rounded-md p-2 transition-colors hover:bg-yellow-400/70 dark:hover:bg-yellow-700/70 {selectedTask.isImportant
								? 'bg-yellow-400/60 dark:bg-yellow-700/60'
								: 'bg-yellow-400/30 dark:bg-yellow-700/30'}"
						>
							<StarIcon
								fill={selectedTask.isImportant ? 'yellow' : 'transparent'}
								class={selectedTask.isImportant ? 'text-yellow-300' : 'text-neutral-500'}
								size="16"
							/>
						</button>
					</div>
				</div>

				<div
					class="rounded-md border-2 border-neutral-200/50 bg-neutral-50 p-3 dark:border-neutral-900 dark:bg-neutral-950"
				>
					<h2 class="pb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
						Organization
					</h2>
					<div class="flex flex-col gap-1">
						<div>
							<p class="py-1 text-xs font-medium text-neutral-500">GROUP</p>

							<Select.Root
								type="single"
								onValueChange={handleGroupSelection}
								items={groups}
								allowDeselect={true}
								bind:value={taskGroupId}
							>
								<Select.Trigger
									class="text-md inline-flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-white
		       px-4 py-1 text-neutral-700 transition-all duration-200
		       ease-in-out select-none placeholder:text-neutral-400 hover:border-neutral-400
		       focus:border-transparent focus:ring-2 focus:ring-black
		       focus:outline-none dark:border-neutral-700
		       dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder:text-neutral-500 dark:focus:ring-white"
									aria-label="Select a theme"
								>
									<div class="flex items-center gap-2">
										<span
											class={selectedLabel === 'No Group'
												? 'text-neutral-500 dark:text-neutral-400'
												: ''}>{selectedLabel}</span
										>
									</div>
									<ChevronDown class="size-4 text-neutral-700 dark:text-neutral-300" />
								</Select.Trigger>

								<Select.Portal>
									{#if groups.length !== 0}
										<Select.Content
											class="z-50 mt-2 max-h-64 w-[var(--bits-select-anchor-width)]
			       overflow-y-auto rounded-lg border border-neutral-300 bg-white shadow-lg
			       dark:border-neutral-700 dark:bg-neutral-900"
											sideOffset={4}
											data-bits-select-group
										>
											<Select.Viewport class="p-1">
												{#each groups as group, i (group.value)}
													<Select.Item
														class="flex w-full cursor-pointer items-center rounded-md px-4 py-2 text-sm text-neutral-800
						       capitalize outline-none hover:bg-neutral-100 focus:bg-neutral-100
						        dark:text-neutral-200
						       dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 "
														value={group.value}
														label={group.label}
													>
														<div
															class="mr-2 size-3 rounded-full"
															style="background-color: {group.color}"
														></div>
														{group.label}
														{#if selectedTask.taskGroupId === group.value}
															<Check
																class="ml-auto size-4 text-neutral-600 dark:text-neutral-300"
															/>
														{/if}
													</Select.Item>
												{/each}
											</Select.Viewport>
										</Select.Content>
									{/if}
								</Select.Portal>
							</Select.Root>
						</div>
					</div>
				</div>

				<div
					class="rounded-md border-2 border-neutral-200/50 bg-neutral-50 p-3 dark:border-neutral-900 dark:bg-neutral-950"
				>
					<h2 class="pb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">Schedule</h2>
					<div class="flex flex-col gap-1">
						<DatePicker label="DUE DATE" bind:value={dueDate} onChange={handleDueDateChange} />
					</div>
				</div>

				<hr class="my-3 border-t border-neutral-200 dark:border-neutral-800" />
				{#if !!selectedTask.completedAt}
					<div
						class="rounded-lg border-1 border-green-400 bg-green-100 p-4 text-sm font-medium text-green-600 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
					>
						Completed
						{DateTime.fromJSDate(selectedTask.completedAt).toLocaleString(
							DateTime.DATE_MED_WITH_WEEKDAY
						)}
					</div>
				{/if}
			</div>
		{/if}
	</section>
</div>
