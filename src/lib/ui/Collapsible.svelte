<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	export let headerText: string = '';

	let isOpen: boolean = false;
</script>

<div>
	<h2>
		<button
			on:click={() => (isOpen = !isOpen)}
			class="flex w-full cursor-pointer justify-between border-none bg-black p-2"
		>
			{headerText}
			<ChevronDown class="transition-transform duration-100 {isOpen ? 'rotate-180' : ''}" />
		</button>
	</h2>
	{#if isOpen}
		<div class="content" transition:slide={{ duration: 100 }}>
			<slot></slot>
		</div>
	{/if}
</div>
