import { PaymentProcessor } from '$lib/server/payments.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const paymentProcessor = PaymentProcessor.getInstance();
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!webhookSecret) {
		return json({ error: 'No secret is set' }, { status: 500 });
	}

	let event;
	const signature = request.headers.get('stripe-signature');
	const body = await request.arrayBuffer();

	if (!signature) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		event = await paymentProcessor.constructEvent(Buffer.from(body), signature, webhookSecret);
	} catch (err) {
		console.log(`Webhook signature verification failed:`, err);

		return json({ error: 'Unexpected error' }, { status: 400 });
	}

	switch (event.type) {
		case 'checkout.session.completed':
		case 'checkout.session.async_payment_succeeded': {
			const success = await paymentProcessor.checkCheckoutStatus(event.data.object.id);
			const userId = event.data.object.metadata?.userId;

			if (success && userId) {
				await paymentProcessor.grantPremium(userId);
			}
			break;
		}
		case 'invoice.paid': {
			const userId = event.data.object.metadata?.userId;

			if (userId) {
				await paymentProcessor.grantPremium(userId);
			}
			break;
		}
		case 'invoice.payment_failed':
			console.error('Failed payment');
			break;
		default:
			console.error('Unhandled event!');
	}

	return json(null, { status: 200 });
}
