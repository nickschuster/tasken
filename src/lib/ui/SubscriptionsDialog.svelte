<script lang="ts">
  import { Dialog } from 'bits-ui';
  import SubscriptionCards from './SubscriptionCards.svelte';
  import type { DefaultSubscriptions } from '$lib/models/subscription';
  import DialogContainer from './dialog/DialogContainer.svelte';
  import { X } from '@lucide/svelte';
  import { logoutPost } from '$lib/services/account.service';

  type Props = {
    open?: boolean;
    subscriptions?: DefaultSubscriptions | null;
  };

  let { open = $bindable(true), subscriptions = null }: Props = $props();

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

<DialogContainer {open}>
  <Dialog.Title class="text-center">
    <h2 class="pb-4 text-4xl font-bold tracking-tighter sm:text-5xl dark:text-white">
      Choose Your Plan
    </h2>
    <button class="absolute top-4 right-4" onclick={logoutPost}><X /></button>
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
</DialogContainer>
