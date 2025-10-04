export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		if (typeof email !== 'string' || !email.includes('@')) {
			return { success: false, message: 'Invalid email address' };
		}

		// Todo: magic link
		console.log('Sending magic link to:', email);
		return { success: true, message: 'Magic link sent to ' + email };
	}
};
