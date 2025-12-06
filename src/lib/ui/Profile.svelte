<script lang="ts">
	import { Dialog, DropdownMenu } from 'bits-ui';
	import DropdownMenuContent from './dropdown/DropdownMenuContent.svelte';
	import DropdownMenuItem from './dropdown/DropdownMenuItem.svelte';
	import DialogContainer from './dialog/DialogContainer.svelte';
	import { accountDelete, logoutPost } from '$lib/services/account.service';

	let { userNameFirstLetter, userEmail } = $props();

	let showDeleteDialog = $state(false);
	let confirmDelete = $state(false);

	// hard code this for now, billing portal link is static
	const BILLING_PORTAL_URL = $derived(
		'https://billing.stripe.com/p/login/9B6eVef7BcYT27zc571kA00' +
			(userEmail ? `?prefilled_email=${encodeURIComponent(userEmail)}` : '')
	);
</script>

<DialogContainer bind:open={showDeleteDialog}>
	<Dialog.Title class="text-center">
		<h2 class="pb-4 text-4xl font-bold tracking-tighter sm:text-5xl dark:text-white">
			Delete Account
		</h2>
	</Dialog.Title>
	<Dialog.Description class="space-y-4">
		<div
			class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20"
		>
			<h3 class="mb-2 font-semibold text-red-800 dark:text-red-200">
				This action cannot be undone
			</h3>
			<p class="text-red-700 dark:text-red-300">
				Deleting your account will permanently remove all of the following data:
			</p>
			<ul class="mt-2 list-inside list-disc space-y-1 text-red-700 dark:text-red-300">
				<li>All tasks and task history</li>
				<li>All groups and group memberships</li>
				<li>Account settings and preferences</li>
				<li>Subscription and billing information (any active subscriptions will be canceled)</li>
			</ul>
		</div>

		<label class="flex cursor-pointer items-center gap-2">
			<input
				type="checkbox"
				bind:checked={confirmDelete}
				class="rounded border-neutral-300 dark:border-neutral-700"
			/>
			<span class="text-sm text-neutral-600 dark:text-neutral-400">
				I understand that this action <b>cannot</b> be undone
			</span>
		</label>

		<div class="flex justify-end gap-2 pt-2">
			<button
				class="rounded-md bg-neutral-200 px-4 py-2 text-neutral-700 transition hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
				onclick={() => {
					showDeleteDialog = false;
					confirmDelete = false;
				}}
			>
				Cancel
			</button>
			<button
				class="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
				disabled={!confirmDelete}
				onclick={accountDelete}
			>
				Delete Account
			</button>
		</div>
	</Dialog.Description>
</DialogContainer>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-2 border-neutral-200/50 bg-neutral-50
			 text-xl font-semibold text-neutral-800 transition
			hover:bg-neutral-300 dark:border-neutral-900
			dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-800"
	>
		{#if userNameFirstLetter}
			{userNameFirstLetter.toUpperCase()}
		{/if}
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenuContent contentProps={{ align: 'bottom' }}>
			<DropdownMenuItem callback={() => window.open(BILLING_PORTAL_URL, '_blank')}>
				<div>Manage Subscription</div>
			</DropdownMenuItem>
			<DropdownMenuItem callback={logoutPost}>
				<div>Logout</div>
			</DropdownMenuItem>
			<DropdownMenuItem callback={() => (showDeleteDialog = true)}>
				<div class="text-red-600 dark:text-red-400">Delete Account</div>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
