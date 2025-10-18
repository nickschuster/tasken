import type Stripe from 'stripe';

export type DefaultSubscriptions = {
	basic: Stripe.Price | null;
	pro: Stripe.Price | null;
	team: Stripe.Price | null;
};
