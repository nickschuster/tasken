<script lang="ts">
	import { CalendarIcon, Circle, House, Plus } from '@lucide/svelte';
	import { DatePicker, DropdownMenu } from 'bits-ui';
	import { elasticOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let {
		newTaskContent = $bindable(''),
		onEnter = () => {}
	}: { newTaskContent?: string; onEnter?: (value: string) => void } = $props();

	let focused = $state(false);

	$effect(() => {
		focused = focused || newTaskContent.trim().length > 0;
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
			<button class="flex gap-2 rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950">
				<House />
				<span>Tasks</span>
			</button>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<button
						class="rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-950"
						onclick={(event) => {
							event.preventDefault();
							event.stopPropagation();
						}}
					>
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
							<DropdownMenu.Item>Today</DropdownMenu.Item>
							<DropdownMenu.Item>Tomorrow</DropdownMenu.Item>
							<DropdownMenu.Item><DatePicker.Root /></DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
	{/if}
</div>
