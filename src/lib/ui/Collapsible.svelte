<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	type Props = {
		headerText?: string;
		children?: Snippet;
	};

	let { headerText = '', children }: Props = $props();

	let isOpen = $state(false);
</script>

<div>
	<h2>
		<button
			onclick={() => (isOpen = !isOpen)}
			class="flex w-full cursor-pointer justify-between border-none bg-white p-2 text-neutral-800 dark:bg-black dark:text-neutral-200"
		>
			{headerText}
			<ChevronDown class="transition-transform duration-100 {isOpen ? 'rotate-180' : ''}" />
		</button>
	</h2>
	{#if isOpen}
		<div class="content" transition:slide={{ duration: 100 }}>
			{@render children?.()}
		</div>
	{/if}
</div>
