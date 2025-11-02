<script lang="ts">
	import type { TaskGroup } from '$lib/server/db/schema';
	import {
		Calendar,
		CalendarIcon,
		ChevronLeft,
		ChevronRight,
		Circle,
		House,
		Plus
	} from '@lucide/svelte';
	import { DatePicker, DropdownMenu, TimeField } from 'bits-ui';
	import { elasticOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let {
		taskGroups = [],
		newTaskContent = $bindable(''),
		onEnter = () => {}
	}: {
		taskGroups: TaskGroup[];
		newTaskContent?: string;
		onEnter?: (value: string) => void;
	} = $props();

	let focused = $state(false);
	let date = $state<DateValue>(undefined);
	let time = $state<any>(undefined);
	let taskGroupId = $state(null);

	$effect(() => {
		focused = focused || newTaskContent.trim().length > 0;
	});

	function setToday() {
		const today = new Date();
		date = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
	}

	function setTomorrow() {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		date = {
			year: tomorrow.getFullYear(),
			month: tomorrow.getMonth() + 1,
			day: tomorrow.getDate()
		};
	}

	function clearDate() {
		date = undefined;
		time = undefined;
	}

	// Clear time if date is removed
	$effect(() => {
		if (!date) {
			time = undefined;
		}
	});
</script>

<div
	class="focus: flex h-14 w-full items-center gap-3 rounded-lg border border-neutral-300 bg-white
       px-3 transition-all duration-200 ease-in-out
      dark:border-neutral-700 dark:bg-neutral-900
      dark:placeholder:text-neutral-500 dark:focus:ring-white {focused
		? 'border-transparent ring-2 ring-black dark:ring-white'
		: ''}"
>
	{#if focused}
		<div in:fade={{ duration: 200, easing: elasticOut }}>
			<Circle size="28" />
		</div>
	{:else}
		<Plus class="display-none text-neutral-500" />
	{/if}

	<input
		type="text"
		class=" grow text-lg
      text-black placeholder:text-neutral-400 focus:outline-none dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-500"
		bind:focused
		bind:value={newTaskContent}
		onkeydown={(event) => {
			if (event.code === 'Enter') {
				onEnter(newTaskContent);
			}
		}}
	/>

	{#if focused && newTaskContent.trim().length !== 0}
		<div class="flex items-center gap-1" transition:fade={{ duration: 200, easing: elasticOut }}>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<button class="flex gap-2 rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950">
						<House />
						<span>Tasks</span>
					</button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Portal>
					<DropdownMenu.Content
						side="top"
						class="z-100 min-w-[180px] rounded-lg border
				border-neutral-200 bg-white p-1.5
				shadow-md focus:outline-none
				dark:border-neutral-700 dark:bg-neutral-900"
					>
						<DropdownMenu.Group>
							{#each taskGroups as taskGroup (taskGroup.id)}
								<DropdownMenu.Item
									class={[
										'cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-900 transition',
										'hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none',
										'dark:text-neutral-100  dark:focus:bg-neutral-700'
									]}
									onclick={() => {
										console.log('clicked', taskGroup.name);
									}}
								>
									<span>{taskGroup.color}</span>
									{taskGroup.name}
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<button class="rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950">
						<CalendarIcon />
					</button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Portal>
					<DropdownMenu.Content
						side="top"
						class="z-100 min-w-[180px] rounded-lg border
				border-neutral-200 bg-white p-1.5
				shadow-md focus:outline-none
				dark:border-neutral-700 dark:bg-neutral-900"
					>
						<DropdownMenu.Group>
							<DropdownMenu.Item
								class={[
									'cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-900 transition',
									'hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none',
									'dark:text-neutral-100  dark:focus:bg-neutral-700'
								]}
								onclick={() => {
									setToday();
								}}>Today</DropdownMenu.Item
							>
							<DropdownMenu.Item
								class={[
									'cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-900 transition',
									'hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none',
									'dark:text-neutral-100  dark:focus:bg-neutral-700'
								]}
								onclick={() => {
									setTomorrow();
								}}>Tomorrow</DropdownMenu.Item
							>
							<DropdownMenu.Item
								closeOnSelect={false}
								class="cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-900 transition hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none dark:text-neutral-100 dark:focus:bg-neutral-700"
								onpointerdown={(e) => {
									e.stopPropagation();
								}}
								onclick={(e) => {
									e.stopPropagation();
								}}
								><DatePicker.Root
									weekdayFormat="short"
									fixedWeeks={true}
									bind:value={date}
									onValueChange={(value) => {
										console.log(value);

										date = value;
									}}
								>
									<DatePicker.Input class="flex w-full items-center gap-2 text-sm">
										{#snippet children({ segments })}
											{#each segments as { part, value }, i (part + i)}
												{#if part === 'literal'}
													<DatePicker.Segment {part} class="text-neutral-500">
														{value}
													</DatePicker.Segment>
												{:else}
													<DatePicker.Segment
														{part}
														class="rounded px-1 hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none aria-[valuetext=Empty]:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-700"
													>
														{value}
													</DatePicker.Segment>
												{/if}
											{/each}
											<DatePicker.Trigger
												class="ml-auto inline-flex items-center justify-center transition-all"
											>
												<Calendar class="size-4" />
											</DatePicker.Trigger>
										{/snippet}
									</DatePicker.Input>
									<DatePicker.Content sideOffset={6} class="z-50">
										<DatePicker.Calendar
											class="rounded-lg border border-neutral-200 bg-white p-4 shadow-md dark:border-neutral-700 dark:bg-neutral-900"
										>
											{#snippet children({ months, weekdays })}
												<DatePicker.Header class="mb-4 flex items-center justify-between">
													<DatePicker.PrevButton
														class="inline-flex size-8 items-center justify-center rounded-md transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800"
													>
														<ChevronLeft class="size-4" />
													</DatePicker.PrevButton>
													<DatePicker.Heading class="text-sm font-medium" />
													<DatePicker.NextButton
														class="inline-flex size-8 items-center justify-center rounded-md transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800"
													>
														<ChevronRight class="size-4" />
													</DatePicker.NextButton>
												</DatePicker.Header>
												<div class="flex flex-col space-y-4">
													{#each months as month (month.value)}
														<DatePicker.Grid class="w-full border-collapse select-none">
															<DatePicker.GridHead>
																<DatePicker.GridRow class="mb-2 flex w-full justify-between">
																	{#each weekdays as day (day)}
																		<DatePicker.HeadCell
																			class="w-8 text-center text-xs font-normal text-neutral-500"
																		>
																			<div>{day.slice(0, 2)}</div>
																		</DatePicker.HeadCell>
																	{/each}
																</DatePicker.GridRow>
															</DatePicker.GridHead>
															<DatePicker.GridBody class="space-y-1">
																{#each month.weeks as weekDates (weekDates)}
																	<DatePicker.GridRow class="flex w-full justify-between">
																		{#each weekDates as date (date)}
																			<DatePicker.Cell
																				{date}
																				month={month.value}
																				class="relative size-8 p-0 text-center text-sm"
																			>
																				<DatePicker.Day
																					class="group relative inline-flex size-8 items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-sm font-normal whitespace-nowrap transition-all hover:bg-neutral-100 data-disabled:pointer-events-none data-disabled:text-neutral-300 data-outside-month:pointer-events-none data-outside-month:text-neutral-400 data-selected:bg-black data-selected:text-white data-unavailable:line-through dark:hover:bg-neutral-800 dark:data-selected:bg-white dark:data-selected:text-black"
																				>
																					<div
																						class="absolute top-1 hidden size-1 rounded-full bg-black transition-all group-data-selected:bg-white group-data-today:block dark:bg-white dark:group-data-selected:bg-black"
																					></div>
																					{date.day}
																				</DatePicker.Day>
																			</DatePicker.Cell>
																		{/each}
																	</DatePicker.GridRow>
																{/each}
															</DatePicker.GridBody>
														</DatePicker.Grid>
													{/each}
												</div>
											{/snippet}
										</DatePicker.Calendar>
									</DatePicker.Content>
								</DatePicker.Root>
							</DropdownMenu.Item>
							{#if date}
								<DropdownMenu.Item
									closeOnSelect={false}
									class="cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-900 transition hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none dark:text-neutral-100 dark:focus:bg-neutral-700"
									onpointerdown={(e) => {
										e.stopPropagation();
									}}
									onclick={(e) => {
										e.stopPropagation();
									}}
								>
									<TimeField.Root
										bind:value={time}
										onValueChange={(value) => {
											if (date) {
												time = value;
											}
										}}
									>
										<TimeField.Input class="flex w-full items-center gap-2 text-sm">
											{#snippet children({ segments })}
												{#each segments as { part, value }, i (part + i)}
													{#if part === 'literal'}
														<TimeField.Segment {part} class="text-neutral-500">
															{value}
														</TimeField.Segment>
													{:else}
														<TimeField.Segment
															{part}
															class="rounded px-1 hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none aria-[valuetext=Empty]:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-700"
														>
															{value}
														</TimeField.Segment>
													{/if}
												{/each}
											{/snippet}
										</TimeField.Input>
									</TimeField.Root>
								</DropdownMenu.Item>
								<DropdownMenu.Item
									class={[
										'cursor-pointer rounded-md px-3 py-2 text-sm transition',
										'text-red-600 hover:bg-red-50 focus:bg-red-100 focus:outline-none',
										'dark:text-red-400 dark:hover:bg-red-950/30 dark:focus:bg-red-950/50'
									]}
									onclick={() => {
										clearDate();
									}}>Clear date & time</DropdownMenu.Item
								>
							{/if}
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
	{/if}
</div>
