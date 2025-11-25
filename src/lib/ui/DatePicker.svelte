<script lang="ts">
	import { DatePicker } from 'bits-ui';
	import { ChevronRightIcon, ChevronLeftIcon, CalendarPlusIcon } from '@lucide/svelte';
	import type { DateValue } from '@internationalized/date';

	type Props = {
		label?: string;
		value: DateValue | undefined;
		onChange?: (change: DateValue | undefined) => void;
	};

	let { label, value = $bindable(), onChange }: Props = $props();
</script>

<DatePicker.Root weekdayFormat="short" fixedWeeks bind:value onValueChange={onChange}>
	<div class="flex w-full flex-col gap-1.5">
		{#if label}
			<DatePicker.Label class="block text-xs font-medium text-neutral-500">
				{label}
			</DatePicker.Label>
		{/if}

		<DatePicker.Input
			class="dark:focus-within:white flex w-full items-center rounded-lg border border-neutral-300 bg-white
			px-3 text-sm text-neutral-700 transition focus-within:ring-2 focus-within:ring-black
			 hover:border-neutral-400 focus:border-transparent focus:outline-none dark:border-neutral-700
			  dark:bg-neutral-900 dark:text-neutral-300 dark:focus-within:ring-white"
		>
			{#snippet children({ segments })}
				{#each segments as { part, value }, i (part + i)}
					<div class="inline-block select-none">
						{#if part === 'literal'}
							<DatePicker.Segment {part} class="p-1 text-neutral-700 dark:text-neutral-300">
								{value}
							</DatePicker.Segment>
						{:else}
							<DatePicker.Segment
								{part}
								class="rounded-md px-1 py-0.5 hover:bg-neutral-100 focus:bg-neutral-200 focus:text-neutral-900 focus-visible:ring-0 focus-visible:ring-offset-0 aria-[valuetext=Empty]:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-700 dark:focus:text-neutral-100"
							>
								{value}
							</DatePicker.Segment>
						{/if}
					</div>
				{/each}
				<DatePicker.Trigger
					class="ml-auto inline-flex size-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
				>
					<CalendarPlusIcon class="size-5" />
				</DatePicker.Trigger>
			{/snippet}
		</DatePicker.Input>

		<DatePicker.Content sideOffset={6} class="z-50 w-full max-w-full">
			<DatePicker.Calendar
				class="w-full rounded-xl border border-neutral-200 bg-white p-5 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
			>
				{#snippet children({ months, weekdays })}
					<DatePicker.Header class="mb-4 flex items-center justify-between">
						<DatePicker.PrevButton
							class="inline-flex size-9 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200 active:scale-95 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
						>
							<ChevronLeftIcon class="size-5" />
						</DatePicker.PrevButton>

						<DatePicker.Heading
							class="text-sm font-medium text-neutral-900 dark:text-neutral-100"
						/>

						<DatePicker.NextButton
							class="inline-flex size-9 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200 active:scale-95 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
						>
							<ChevronRightIcon class="size-5" />
						</DatePicker.NextButton>
					</DatePicker.Header>

					<div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
						{#each months as month (month.value)}
							<DatePicker.Grid class="w-full space-y-1 select-none">
								<DatePicker.GridHead>
									<DatePicker.GridRow class="mb-1 flex justify-between">
										{#each weekdays as day (day)}
											<DatePicker.HeadCell
												class="w-8 text-center text-xs text-neutral-500 dark:text-neutral-400"
											>
												{day.slice(0, 2)}
											</DatePicker.HeadCell>
										{/each}
									</DatePicker.GridRow>
								</DatePicker.GridHead>

								<DatePicker.GridBody>
									{#each month.weeks as weekDates (weekDates)}
										<DatePicker.GridRow class="flex justify-between">
											{#each weekDates as date (date)}
												<DatePicker.Cell {date} month={month.value} class="relative size-8">
													<DatePicker.Day
														class="inline-flex size-8 items-center justify-center rounded-md text-sm transition hover:bg-neutral-100 data-disabled:text-neutral-300 data-selected:bg-neutral-900 data-selected:text-white data-unavailable:line-through dark:hover:bg-neutral-800 dark:data-disabled:text-neutral-600 dark:data-selected:bg-neutral-100 dark:data-selected:text-neutral-900"
													>
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
	</div>
</DatePicker.Root>
