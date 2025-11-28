<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import DropdownMenuContent from './dropdown/DropdownMenuContent.svelte';
	import DropdownMenuItem from './dropdown/DropdownMenuItem.svelte';
	import { wsService } from '$lib/services/ws.service';
	import { PostHog } from '$lib/services/posthog.service';

	let { userNameFirstLetter, userEmail } = $props();

	// hard code this for now, billing portal link is static
	const BILLING_PORTAL_URL = $derived(
		'https://billing.stripe.com/p/login/9B6eVef7BcYT27zc571kA00' +
			(userEmail ? `?prefilled_email=${encodeURIComponent(userEmail)}` : '')
	);

	const handleLogout = async () => {
		try {
			const response = await fetch('?/logout', {
				method: 'POST',
				body: '',
				headers: {
					'x-sveltekit-action': 'true'
				}
			});

			const body = await response.json();

			if (response.ok) {
				wsService.setShouldReconnect(false);

				PostHog.reset();
			}

			if (body.status === 302) {
				window.location.href = body.location;
			}
		} catch (e) {
			console.error('Logout failed', e);
		}
	};
</script>

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
			<DropdownMenuItem callback={handleLogout}>
				<div>Logout</div>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
