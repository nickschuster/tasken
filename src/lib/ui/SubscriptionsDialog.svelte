<script lang="ts">
	import { Dialog } from 'bits-ui';
	import SubscriptionCards from './SubscriptionCards.svelte';
	import type { DefaultSubscriptions } from '$lib/models/subscription';

	export let open = true;
	export let subscriptions: DefaultSubscriptions | null = null;

	const choosePlan = async (plan: 'basic' | 'pro' | 'team') => {
		if (!subscriptions) return;

		const price = subscriptions[plan];

		const result = await fetch('/api/payments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ priceId: price?.id })
		});

		if (result.ok) {
			const { url } = await result.json();

			window.location.href = url;
		}
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
		<Dialog.Content
			escapeKeydownBehavior="ignore"
			interactOutsideBehavior="ignore"
			class="fixed top-[50%] left-[50%] z-50 max-h-[calc(100%)] w-full max-w-[calc(100%)] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-lg bg-white p-5 shadow-md outline-hidden sm:max-w-[900px] md:w-full dark:bg-black"
		>
			<Dialog.Title class="text-center">
				<h2 class="pb-4 text-4xl font-bold tracking-tighter sm:text-5xl dark:text-white">
					Choose Your Plan
				</h2>
			</Dialog.Title>
			<Dialog.Description>
				<div class="flex flex-col gap-4 md:flex-row">
					<SubscriptionCards
						basicPrice={subscriptions?.basic?.unit_amount ?? null}
						proPrice={subscriptions?.pro?.unit_amount ?? null}
						teamPrice={subscriptions?.team?.unit_amount ?? null}
						{choosePlan}
					/>
				</div>
			</Dialog.Description>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
