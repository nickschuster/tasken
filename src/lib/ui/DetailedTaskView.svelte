<script lang="ts">
	import { Check, ChevronDown, StarIcon, X } from '@lucide/svelte';
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
		'flex h-screen flex-col border-l border-neutral-200 bg-white text-neutral-800 transition-all duration-150 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200',
		isMobile && 'fixed top-0 right-0 z-50 w-80 transform shadow-lg',
		isMobile && (isTaskViewOpen ? 'translate-x-0' : 'translate-x-full'),
		!isMobile && 'md:static md:flex md:h-screen',
		!isMobile && (isTaskViewOpen ? 'md:w-80' : 'md:w-0 md:overflow-hidden')
	]}
	bind:this={taskViewElement}
>
	<section
		class="flex h-full w-full flex-col bg-white p-4 transition-colors duration-300 dark:bg-neutral-950"
	>
		{#if selectedTaskId && selectedTask}
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Task Details</h2>
				<button
					onclick={() => (selectedTaskId = null)}
					class="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
				>
					<X class="size-5" />
				</button>
			</div>

			<div class="flex flex-col gap-5">
				<!-- Task Name Section -->
				<div class="space-y-2">
					<label for="task-name" class="text-sm font-medium text-neutral-600 dark:text-neutral-400">
						Task Name
					</label>
					<div class="flex items-center gap-2">
						<input
							id="task-name"
							type="text"
							class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 transition placeholder:text-neutral-400 hover:border-neutral-400 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-white"
							bind:value={content}
							placeholder="Enter task name..."
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
							aria-label="Mark as important"
							onclick={handleIsImportantToggle}
							class="flex size-9 flex-shrink-0 items-center justify-center rounded-md transition-colors {selectedTask.isImportant
								? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-400 dark:hover:bg-yellow-900'
								: 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300'}"
						>
							<StarIcon
								fill={selectedTask.isImportant ? 'currentColor' : 'transparent'}
								class="size-4"
							/>
						</button>
					</div>
				</div>

				<hr class="border-neutral-200 dark:border-neutral-800" />

				<!-- Group Section -->
				<div class="space-y-2">
					<span class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Group</span>
					<Select.Root
						type="single"
						onValueChange={handleGroupSelection}
						items={groups}
						allowDeselect={true}
						bind:value={taskGroupId}
						disabled={groups.length === 0}
					>
						<Select.Trigger
							class="inline-flex w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 transition select-none hover:border-neutral-400 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-white dark:disabled:hover:border-neutral-700"
							aria-label="Select a group"
						>
							<div class="flex items-center gap-2">
								{#if selectedLabel !== 'No Group'}
									{@const selectedGroup = groups.find((g) => g.value === taskGroupId)}
									{#if selectedGroup}
										<span
											class="size-2.5 rounded-full"
											style="background-color: {selectedGroup.color}"
										></span>
									{/if}
								{/if}
								<span
									class={selectedLabel === 'No Group'
										? 'text-neutral-500 dark:text-neutral-400'
										: ''}
								>
									{selectedLabel}
								</span>
							</div>
							<ChevronDown class="size-4 text-neutral-500 dark:text-neutral-400" />
						</Select.Trigger>

						<Select.Portal>
							{#if groups.length !== 0}
								<Select.Content
									class="z-50 mt-1 max-h-64 w-[var(--bits-select-anchor-width)] overflow-y-auto rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
									sideOffset={4}
									data-bits-select-group
								>
									<Select.Viewport class="p-1">
										{#each groups as group, i (group.value)}
											<Select.Item
												class="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-800 transition-colors outline-none hover:bg-neutral-100 focus:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
												value={group.value}
												label={group.label}
											>
												<span class="size-2.5 rounded-full" style="background-color: {group.color}"
												></span>
												<span class="flex-1">{group.label}</span>
												{#if selectedTask.taskGroupId === group.value}
													<Check class="size-4 text-neutral-600 dark:text-neutral-300" />
												{/if}
											</Select.Item>
										{/each}
									</Select.Viewport>
								</Select.Content>
							{/if}
						</Select.Portal>
					</Select.Root>
				</div>

				<!-- Due Date Section -->
				<div class="space-y-2">
					<span class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Due Date</span>
					<DatePicker bind:value={dueDate} onChange={handleDueDateChange} />
				</div>

				<!-- Completion Status -->
				{#if !!selectedTask.completedAt}
					<div
						class="mt-2 flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-2 dark:bg-neutral-900"
					>
						<Check class="size-4 text-neutral-600 dark:text-neutral-400" />
						<span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
							Completed {DateTime.fromJSDate(
								typeof selectedTask.completedAt === 'string'
									? new Date(selectedTask.completedAt)
									: selectedTask.completedAt
							).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
						</span>
					</div>
				{/if}
			</div>
		{/if}
	</section>
</div>
