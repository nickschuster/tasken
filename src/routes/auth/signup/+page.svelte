<script lang="ts">
	import { enhance } from '$app/forms';
	import { CircleCheckBigIcon } from '@lucide/svelte';

	let { form } = $props();

	let sent = $state(false);

	$effect(() => {
		if (form?.success) {
			sent = true;
		}
	});
</script>

<div class="grid h-screen lg:grid-cols-2 dark:bg-black dark:text-white">
	<div
		class="col-span-1 hidden h-screen bg-gradient-to-tl from-neutral-950 via-neutral-800 to-neutral-950 lg:grid lg:place-items-center"
	>
		<CircleCheckBigIcon size="400" color="grey" />
	</div>
	<div class="col-span-1 h-screen">
		<div class="flex h-full w-full flex-col items-center justify-between">
			{#if !sent}
				<div class="mt-auto mb-auto flex w-xs flex-col gap-2 text-center lg:w-md">
					<h1 class="text-3xl font-bold tracking-tighter lg:text-4xl">Welcome to Tasken.</h1>
					<p class="text-lg text-neutral-600 dark:text-neutral-400">Sync. Share. Succeed.</p>
					{#if form?.error}
						<p class="text-small text-red-500">{form.error}</p>
					{/if}
					<form method="POST" use:enhance class="flex flex-col gap-3">
						<input
							type="email"
							name="email"
							placeholder="Email"
							required
							class="rounded-lg border border-neutral-300 bg-white px-4
      py-3 text-lg text-neutral-800 transition-all
      duration-200 ease-in-out placeholder:text-neutral-400
      focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none
      dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200
      dark:placeholder:text-neutral-500 dark:focus:ring-white"
						/>
						<button
							type="submit"
							class="rounded-md bg-black px-8 py-3 font-semibold text-white transition-transform duration-200 ease-in-out will-change-transform hover:scale-101 dark:bg-white dark:text-black"
							>Continue with email</button
						>
					</form>
					<h2 class="mt-2 mb-3 w-full border-b border-neutral-300 text-center leading-[0.1]">
						<span class="bg-white px-2 dark:bg-black">or</span>
					</h2>
					<div class="flex flex-col justify-center gap-2">
						<button
							type="button"
							class="w-full rounded-md border border-neutral-300 px-8 py-3 font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
						>
							Google
						</button>
						<button
							type="button"
							class="w-full rounded-md border border-neutral-300 px-8 py-3 font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
						>
							GitHub
						</button>
					</div>
				</div>
			{:else}
				<div
					class="mt-auto mb-auto flex w-xs flex-col gap-2 text-center
				lg:w-md"
				>
					<h1 class="text-3xl font-bold tracking-tighter lg:text-4xl">Check your inbox.</h1>
					<p class="text-lg text-neutral-600 dark:text-neutral-400">
						We sent a login link to your email address.
					</p>
					<button
						type="button"
						class="text-neutral-500 hover:cursor-pointer dark:text-neutral-600"
						onclick={() => (sent = false)}
					>
						Didn't receive the email?
					</button>
				</div>
			{/if}
			<div class="mb-8 flex gap-6">
				<a
					href="https://github.com/nickschuster/tasken"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-black dark:hover:text-white">GitHub</a
				>
				<a href="/terms" class="hover:text-black dark:hover:text-white">Terms</a>
				<a href="/privacy" class="hover:text-black dark:hover:text-white">Privacy</a>
			</div>
		</div>
	</div>
</div>
