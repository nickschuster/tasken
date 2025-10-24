<script lang="ts">
	import { formatCurrency } from '$lib/utils/currency';
	import { ChartColumn, Check, GitMerge, LayoutGrid, Users } from '@lucide/svelte';

	export let basicPrice: number | null = null;
	export let proPrice: number | null = null;
	export let teamPrice: number | null = null;

	export let choosePlan = (plan: 'basic' | 'pro' | 'team') => {};
</script>

<div class="flex flex-col rounded-lg border-2 border-black p-8 dark:border-white">
	<h3 class="text-2xl font-semibold dark:text-white">Basic</h3>
	<p class="mt-2 text-neutral-600 dark:text-neutral-400">For individuals and small projects.</p>
	<div class="my-8">
		<span class="text-5xl font-bold dark:text-white"
			>{basicPrice ? formatCurrency(basicPrice / 100) : 'TBA'}</span
		>
		<span class="text-lg text-neutral-600 dark:text-neutral-400">/ month</span>
	</div>
	<ul class="flex-grow space-y-4">
		<li class="flex items-center gap-3">
			<Check class="h-5 w-5 flex-shrink-0 text-green-500" /><span class="dark:text-white"
				>Hosted Cloud Sync</span
			>
		</li>
		<li class="flex items-center gap-3">
			<Check class="h-5 w-5 flex-shrink-0 text-green-500" /><span class="dark:text-white"
				>Unlimited Tasks & Lists</span
			>
		</li>
		<li class="flex items-center gap-3">
			<Check class="h-5 w-5 flex-shrink-0 text-green-500" /><span class="dark:text-white"
				>Advanced Reminders</span
			>
		</li>
		<li class="flex items-center gap-3">
			<Check class="h-5 w-5 flex-shrink-0 text-green-500" /><span class="dark:text-white"
				>Priority Support</span
			>
		</li>
	</ul>
	{#if basicPrice}
		<button
			onclick={() => choosePlan('basic')}
			class="mt-8 block w-full cursor-pointer rounded-md bg-black py-3 text-center font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-black"
			>Choose Basic</button
		>
	{:else}
		<button
			disabled
			class="mt-8 block w-full cursor-not-allowed rounded-md bg-neutral-200 py-3 text-center font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"
			>Coming Soon</button
		>
	{/if}
</div>

<div
	class="flex flex-col rounded-lg border border-neutral-200 p-8 opacity-70 grayscale dark:border-neutral-800"
>
	<h3 class="text-2xl font-semibold dark:text-white">Pro</h3>
	<p class="mt-2 text-neutral-500">For power users and professionals.</p>
	<div class="my-8">
		<span class="text-5xl font-bold dark:text-white"
			>{proPrice ? formatCurrency(proPrice / 100) : 'TBA'}</span
		>
	</div>
	<ul class="flex-grow space-y-4 text-neutral-600 dark:text-neutral-400">
		<li class="flex items-center gap-3 font-semibold">
			<Check class="h-5 w-5 flex-shrink-0" /><span>Everything in Basic, plus:</span>
		</li>
		<li class="flex items-center gap-3">
			<LayoutGrid class="h-5 w-5 flex-shrink-0" /><span>Project Boards</span>
		</li>
		<li class="flex items-center gap-3">
			<ChartColumn class="h-5 w-5 flex-shrink-0" /><span>Advanced Analytics</span>
		</li>
		<li class="flex items-center gap-3">
			<GitMerge class="h-5 w-5 flex-shrink-0" /><span>Git & API Integrations</span>
		</li>
	</ul>
	{#if proPrice}
		<button
			onclick={() => choosePlan('pro')}
			class="mt-8 block w-full cursor-pointer rounded-md bg-black py-3 text-center font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-black"
			>Choose Pro</button
		>
	{:else}
		<button
			disabled
			class="mt-8 block w-full cursor-not-allowed rounded-md bg-neutral-200 py-3 text-center font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"
			>Coming Soon</button
		>
	{/if}
</div>

<div
	class="flex flex-col rounded-lg border border-neutral-200 p-8 opacity-70 grayscale dark:border-neutral-800"
>
	<h3 class="text-2xl font-semibold dark:text-white">Team</h3>
	<p class="mt-2 text-neutral-500">For collaborative organizations.</p>
	<div class="my-8">
		<span class="text-5xl font-bold dark:text-white"
			>{teamPrice ? formatCurrency(teamPrice / 100) : 'TBA'}</span
		>
	</div>
	<ul class="flex-grow space-y-4 text-neutral-600 dark:text-neutral-400">
		<li class="flex items-center gap-3 font-semibold">
			<Check class="h-5 w-5 flex-shrink-0" /><span>Everything in Pro, plus:</span>
		</li>
		<li class="flex items-center gap-3">
			<Users class="h-5 w-5 flex-shrink-0" /><span>Shared Workspaces</span>
		</li>
		<li class="flex items-center gap-3">
			<Users class="h-5 w-5 flex-shrink-0" /><span>Collaborative Task Lists</span>
		</li>
		<li class="flex items-center gap-3">
			<Users class="h-5 w-5 flex-shrink-0" /><span>Admin & User Roles</span>
		</li>
	</ul>
	{#if teamPrice}
		<button
			onclick={() => choosePlan('team')}
			class="mt-8 block w-full cursor-pointer rounded-md bg-black py-3 text-center font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-black"
			>Choose Team</button
		>
	{:else}
		<button
			disabled
			class="mt-8 block w-full cursor-not-allowed rounded-md bg-neutral-200 py-3 text-center font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"
			>Coming Soon</button
		>
	{/if}
</div>
