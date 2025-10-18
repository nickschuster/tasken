import { json } from '@sveltejs/kit';
import { PaymentProcessor } from '$lib/server/payments';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { priceId } = await request.json();

	if (!priceId) {
		return json({ error: 'Price ID is required' }, { status: 400 });
	}

	const paymentProcessor = PaymentProcessor.getInstance();

	const paymentSession = await paymentProcessor.createCheckoutSession({
		customer_email: locals.user.email,
		mode: 'subscription',
		line_items: [{ price: priceId, quantity: 1 }],
		allow_promotion_codes: true,
		success_url: `${process.env.BASE_URL}/home?sessionId={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.BASE_URL}/home`,
		metadata: {
			userId: locals.user.id
		}
	});

	if (!paymentSession.url) {
		return json({ error: 'Failed to create payment session' }, { status: 500 });
	}

	return json({ url: paymentSession.url });
}
