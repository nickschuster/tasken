import { DateTime } from 'luxon';
import { Stripe } from 'stripe';
import dotenv from 'dotenv';
import type { DefaultSubscriptions } from '$lib/models/subscription';
import { grantPremium } from './users';

dotenv.config();

export class PaymentProcessor {
	private static instance: PaymentProcessor;
	private stripe: Stripe;

	private constructor() {
		if (!process.env.STRIPE_API_KEY) {
			throw new Error('STRIPE_API_KEY is not defined in environment variables');
		}

		this.stripe = new Stripe(process.env.STRIPE_API_KEY);
	}

	static getInstance() {
		if (!PaymentProcessor.instance) {
			PaymentProcessor.instance = new PaymentProcessor();
		}

		return PaymentProcessor.instance;
	}

	getProducts() {
		return this.stripe.products.list({ active: true, expand: ['data.default_price'] });
	}

	getPrices() {
		return this.stripe.prices.list({ active: true });
	}

	getProductById(id: string) {
		return this.stripe.products.retrieve(id);
	}

	getPriceById(id: string) {
		return this.stripe.prices.retrieve(id);
	}

	createCheckoutSession(params: Stripe.Checkout.SessionCreateParams) {
		return this.stripe.checkout.sessions.create(params);
	}

	async checkCheckoutStatus(sessionId: string) {
		const session = await this.stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== 'unpaid') {
			const created = DateTime.fromSeconds(session.created).startOf('day');
			const today = DateTime.now().startOf('day');

			return created.equals(today);
		}

		return false;
	}

	async getDefaultSubscriptions(): Promise<DefaultSubscriptions> {
		const products = await this.getProducts();

		const basic = products.data.find((product) => product.name === 'Basic');
		const pro = products.data.find((product) => product.name === 'Pro');
		const team = products.data.find((product) => product.name === 'Team');

		return {
			basic: basic ? (basic.default_price as Stripe.Price) : null,
			pro: pro ? (pro.default_price as Stripe.Price) : null,
			team: team ? (team.default_price as Stripe.Price) : null
		};
	}

	async getSubscriptionDetails(premiumExpiresAt: Date | null): Promise<{
		isPremium: boolean;
		isFirstTimeSubscriber?: boolean;
		subscriptions?: DefaultSubscriptions;
	}> {
		const today = DateTime.now();
		const premiumExpiry = premiumExpiresAt ? DateTime.fromJSDate(premiumExpiresAt) : null;

		if (premiumExpiry && premiumExpiry > today) {
			return {
				isPremium: true
			};
		}

		if (!premiumExpiry) {
			return {
				isPremium: false,
				isFirstTimeSubscriber: true,
				subscriptions: await this.getDefaultSubscriptions()
			};
		}

		return {
			isPremium: false,
			isFirstTimeSubscriber: false,
			subscriptions: await this.getDefaultSubscriptions()
		};
	}

	async grantPremium(userId: string) {
		return grantPremium(userId);
	}

	async constructEvent(data: Buffer<ArrayBufferLike>, signature: string, secret: string) {
		return this.stripe.webhooks.constructEvent(data, signature, secret);
	}

	async deleteCustomerAndCancelSubscriptions(email: string) {
		const customers = await this.stripe.customers.list({ email });

		for await (const customer of customers.data) {
			await this.stripe.customers.del(customer.id);
		}
	}
}
