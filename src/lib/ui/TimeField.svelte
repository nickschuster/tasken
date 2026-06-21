<script lang="ts">
	import { TimeField } from 'bits-ui';
	import type { Time } from '@internationalized/date';

	let {
		value = $bindable(),
		labelText = 'Time',
		handleValueChange = () => {}
	}: {
		value?: Time;
		labelText?: string;
		handleValueChange?: (value: Time | undefined) => void;
	} = $props();
</script>

<TimeField.Root bind:value onValueChange={handleValueChange}>
	<div class="flex w-full flex-col gap-1.5">
		<div class="flex flex-row justify-between">
			<TimeField.Label
				class="block text-sm font-medium text-neutral-600 select-none dark:text-neutral-400"
			>
				{labelText}
			</TimeField.Label>

			<button
				onclick={() => handleValueChange(undefined)}
				class="text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
				>Clear</button
			>
		</div>

		<TimeField.Input
			name="time"
			class="flex h-10 w-full items-center rounded-md border border-neutral-300
				bg-white px-2 py-3 tracking-[0.01em] text-black select-none
				focus-within:border-neutral-400 hover:border-neutral-400
				data-[invalid]:border-red-500
				md:text-sm dark:border-neutral-700
				dark:bg-neutral-900 dark:text-white
				dark:focus-within:border-neutral-500
				dark:hover:border-neutral-500"
		>
			{#snippet children({ segments })}
				{#each segments as { part, value }, i (part + i)}
					<div class="inline-block select-none">
						{#if part === 'literal'}
							<TimeField.Segment {part} class="p-1 text-neutral-400 dark:text-neutral-500">
								{value}
							</TimeField.Segment>
						{:else}
							<TimeField.Segment
								{part}
								class="rounded-sm px-1 py-1 text-black
									hover:bg-neutral-200 focus:bg-neutral-200
									focus-visible:outline-none
									aria-[valuetext=Empty]:text-neutral-400
									data-[invalid]:text-red-500 dark:text-white
									dark:hover:bg-neutral-800 dark:focus:bg-neutral-800
									dark:aria-[valuetext=Empty]:text-neutral-500"
							>
								{value}
							</TimeField.Segment>
						{/if}
					</div>
				{/each}
			{/snippet}
		</TimeField.Input>
	</div>
</TimeField.Root>
