<script lang="ts">
	import { Check, ChevronDown, StarIcon, X } from '@lucide/svelte';
	import { DateTime } from 'luxon';
	import { Select, ToggleGroup } from 'bits-ui';
	import { type TaskGroup, type Task } from '$lib/server/db/schema';
	import { getLocalTimeZone, CalendarDate, Time } from '@internationalized/date';
	import DatePicker from '$lib/ui/DatePicker.svelte';
	import TimeField from '$lib/ui/TimeField.svelte';
	import { isToday, isTomorrow } from '$lib/utils/date';
	import { REPEAT_PRESETS, REPEAT_DAYS, RepeatUnit } from '$lib/models/repeat';

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

	let repeat = $derived.by(() => {
		if (!selectedTask?.repeatUnit || !selectedTask?.repeatInterval) return 'Never';

		if (
			selectedTask?.repeatDays ||
			(selectedTask?.repeatInterval !== 1 && selectedTask?.repeatUnit !== RepeatUnit.WEEK)
		)
			return 'Custom';

		const preset = REPEAT_PRESETS.find(
			(p) => p.unit === selectedTask?.repeatUnit && p.interval === selectedTask?.repeatInterval
		);

		return preset?.value ?? 'Custom';
	});

	let repeatTime = $derived<Time | undefined>(
		selectedTask?.repeatTime
			? new Time(...selectedTask.repeatTime.split(':').map(Number))
			: undefined
	);

	let customRepeatUnit = $derived(selectedTask?.repeatUnit ?? RepeatUnit.DAY);

	let customRepeatDays = $derived<string[]>(
		selectedTask?.repeatDays?.split(',').map((v) => REPEAT_DAYS[Number(v)]) ?? []
	);

	let customRepeatInterval = $derived(selectedTask?.repeatInterval ?? 1);

	const repeatLabels = [
		{
			label: 'Never',
			value: 'Never'
		},
		...REPEAT_PRESETS.map((preset) => ({
			label: preset.value,
			value: preset.value
		})),
		{
			label: 'Custom',
			value: 'Custom'
		}
	];

	const repeatUnits = Object.values(RepeatUnit).map((unit) => ({
		label: (unit + '(s)') as string,
		value: unit as string
	}));

	const setToday = () => {
		const now = new Date();
		const todayCalendar = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
		dueDate = todayCalendar;
		handleDueDateChange();
	};

	const setTomorrow = () => {
		const now = new Date();
		const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

		const tomorrowCalendar = new CalendarDate(
			tomorrow.getFullYear(),
			tomorrow.getMonth() + 1,
			tomorrow.getDate()
		);
		dueDate = tomorrowCalendar;
		handleDueDateChange();
	};

	const handleContentChange = () => {
		if (selectedTask && content.trim().length > 0) {
			selectedTask = { ...selectedTask, content: content };
			updateTask(selectedTask.id, { content: content });
		} else {
			content = selectedTask?.content ?? '';
		}
	};

	const handleDocumentClick = async (e: MouseEvent) => {
		if (!isTaskViewOpen || !taskViewElement) return;

		const calendar = (e.target as HTMLElement)?.closest('[data-calendar-grid]');
		const selectMenu = (e.target as HTMLElement)?.closest('[data-bits-select-group]');
		const detailedTaskView = taskViewElement?.contains(e.target as Node);
		const task = (e.target as HTMLElement)?.closest('.taskItem');

		if (calendar || selectMenu || detailedTaskView || task) return;

		selectedTaskId = null;
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

	const handleRepeatPreset = (value: string) => {
		if (!selectedTask) return;

		if (value === 'Never') {
			selectedTask.repeatUnit = null;
			selectedTask.repeatInterval = 1;
			selectedTask.repeatDays = null;
			selectedTask.repeatTime = null;
		} else {
			const preset = REPEAT_PRESETS.find((p) => p.value === value);
			if (!preset) return;

			selectedTask.repeatUnit = preset.unit;
			selectedTask.repeatInterval = preset.interval;
			selectedTask.repeatDays = null;
		}

		updateTask(selectedTask.id, {
			repeatUnit: selectedTask.repeatUnit,
			repeatInterval: selectedTask.repeatInterval,
			repeatDays: selectedTask.repeatDays,
			repeatTime: selectedTask.repeatTime
		});
	};

	const handleRepeatTime = (value: Time | undefined) => {
		if (!selectedTask) return;

		selectedTask.repeatTime = value ? value.toString() : null;

		updateTask(selectedTask.id, { repeatTime: selectedTask.repeatTime });
	};

	const handleCustomRepeatUnit = (unit: string) => {
		if (!selectedTask) return;

		selectedTask.repeatUnit = unit;

		if (unit !== RepeatUnit.WEEK) {
			selectedTask.repeatDays = null;
		}

		updateTask(selectedTask.id, {
			repeatUnit: selectedTask.repeatUnit,
			repeatDays: selectedTask.repeatDays
		});
	};

	const handleCustomInterval = (interval: number) => {
		if (!selectedTask) return;

		selectedTask.repeatInterval = Math.max(1, interval);

		updateTask(selectedTask.id, {
			repeatInterval: selectedTask.repeatInterval
		});
	};

	const handleCustomWeekdays = (days: string[]) => {
		if (!selectedTask || customRepeatUnit !== RepeatUnit.WEEK) return;

		selectedTask.repeatDays = days.length
			? days.map((day) => REPEAT_DAYS.findIndex((d) => d === day)).join(',')
			: null;

		updateTask(selectedTask.id, {
			repeatDays: selectedTask.repeatDays
		});
	};
</script>

<svelte:window bind:innerWidth on:mousedown={handleDocumentClick} />

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
										{#each groups as group (group.value)}
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
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-neutral-600 dark:text-neutral-400">
							Due Date
						</span>

						<div class="flex gap-3 text-xs font-medium dark:text-neutral-400">
							<button
								onclick={setToday}
								class="hover:text-neutral-900 dark:hover:text-neutral-100
							{isToday(dueDate?.toDate(getLocalTimeZone()))
									? 'text-black dark:text-white'
									: 'text-neutral-600 dark:text-neutral-400'}"
							>
								Today
							</button>
							<button
								onclick={setTomorrow}
								class="hover:text-neutral-900 dark:hover:text-neutral-100
							{isTomorrow(dueDate?.toDate(getLocalTimeZone()))
									? 'text-black dark:text-white'
									: 'text-neutral-600 dark:text-neutral-400'}"
							>
								Tomorrow
							</button>
						</div>
					</div>

					<DatePicker bind:value={dueDate} onChange={handleDueDateChange} />
				</div>

				<!-- Repeat Section -->
				{#if dueDate}
					<div class="space-y-2">
						<span class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Repeat</span>
						<Select.Root
							type="single"
							onValueChange={handleRepeatPreset}
							items={repeatLabels}
							bind:value={repeat}
							disabled={!dueDate}
						>
							<Select.Trigger
								class="inline-flex w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 transition select-none hover:border-neutral-400 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-white dark:disabled:hover:border-neutral-700"
								aria-label="Select repeat schedule"
							>
								{repeat}
								<ChevronDown class="size-4 text-neutral-500 dark:text-neutral-400" />
							</Select.Trigger>

							<Select.Portal>
								{#if repeatLabels.length !== 0}
									<Select.Content
										class="z-50 mt-1 max-h-64 w-[var(--bits-select-anchor-width)] overflow-y-auto rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
										sideOffset={4}
										data-bits-select-group
									>
										<Select.Viewport class="p-1">
											{#each repeatLabels as label (label.value)}
												<Select.Item
													class="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-800 transition-colors outline-none hover:bg-neutral-100 focus:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
													value={label.value}
													label={label.label}
												>
													<span class="flex-1">{label.label}</span>
												</Select.Item>
											{/each}
										</Select.Viewport>
									</Select.Content>
								{/if}
							</Select.Portal>
						</Select.Root>
					</div>

					{#if repeat === 'Custom'}
						<div class="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
							<div class="flex w-full flex-row items-center justify-between">
								<label
									for="repeat-interval"
									class="text-sm font-medium text-neutral-600 dark:text-neutral-400"
								>
									Repeat every
								</label>

								<div>
									<input
										id="repeat-interval"
										type="number"
										min={1}
										bind:value={customRepeatInterval}
										class="w-16 rounded-md border border-neutral-300 bg-white px-3 py-2 text-center text-sm text-neutral-900 transition
                                            hover:border-neutral-400
                                            focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none
                                            disabled:cursor-not-allowed disabled:opacity-50
                                            dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100
                                            dark:focus:ring-white"
										onchange={() => handleCustomInterval(customRepeatInterval)}
									/>

									<Select.Root
										type="single"
										onValueChange={handleCustomRepeatUnit}
										items={repeatUnits}
										bind:value={customRepeatUnit}
										disabled={!dueDate}
									>
										<Select.Trigger
											class="inline-flex min-w-[96px] items-center justify-between rounded-md
                                                border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900
                                                transition select-none
                                                hover:border-neutral-400
                                                focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none
                                                disabled:cursor-not-allowed disabled:opacity-50
                                                disabled:hover:border-neutral-300
                                                dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100
                                                dark:focus:ring-white dark:disabled:hover:border-neutral-700"
											aria-label="Select repeat schedule"
										>
											{customRepeatUnit + '(s)'}
											<ChevronDown class="ml-2 size-4 text-neutral-500 dark:text-neutral-400" />
										</Select.Trigger>

										<Select.Portal>
											{#if repeatUnits.length !== 0}
												<Select.Content
													class="z-50 mt-1 max-h-64 w-[var(--bits-select-anchor-width)]
                                                        overflow-y-auto rounded-md border border-neutral-200
                                                        bg-white shadow-lg
                                                        dark:border-neutral-800 dark:bg-neutral-900"
													sideOffset={4}
												>
													<Select.Viewport class="p-1">
														{#each repeatUnits as label (label.value)}
															<Select.Item
																class="flex w-full cursor-pointer items-center gap-2 rounded-md
                                                                    px-3 py-2 text-sm text-neutral-800 transition-colors
                                                                    outline-none
                                                                    hover:bg-neutral-100 focus:bg-neutral-100
                                                                    dark:text-neutral-200
                                                                    dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
																value={label.value}
																label={label.label}
															>
																<span class="flex-1">{label.label}</span>
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

						{#if customRepeatUnit === RepeatUnit.WEEK}
							<ToggleGroup.Root
								bind:value={customRepeatDays}
								onValueChange={handleCustomWeekdays}
								type="multiple"
								class="flex h-10 items-center gap-x-0.5 rounded-md border border-neutral-300 bg-white px-1 py-1 dark:border-neutral-700 dark:bg-neutral-900"
							>
								{#each REPEAT_DAYS as day (day)}
									<ToggleGroup.Item
										aria-label="toggle bold"
										value={day}
										class="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-600
                                            transition-all
                                            hover:bg-neutral-200 hover:text-neutral-900
                                            active:scale-[0.98] active:bg-neutral-300
                                            data-[state=on]:bg-neutral-200 data-[state=on]:text-black
                                            dark:text-neutral-400
                                            dark:hover:bg-neutral-800 dark:hover:text-neutral-100
                                            dark:active:bg-neutral-700
                                            dark:data-[state=on]:bg-neutral-800 dark:data-[state=on]:text-white"
									>
										{day}
									</ToggleGroup.Item>
								{/each}
							</ToggleGroup.Root>
						{/if}
					{/if}

					{#if repeat !== 'Never' && repeat !== 'Hourly' && customRepeatUnit !== RepeatUnit.HOUR}
						<TimeField bind:value={repeatTime} handleValueChange={handleRepeatTime} />
					{/if}
				{/if}

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
