import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { UUIDV4 } from './helper';
import * as table from '$lib/server/db/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { VerificationStatus, VerificationType } from '$lib/models/verification';
import { sendEmail } from './email';

const MAGIC_LINK_EXPIRY_MS = 1000 * 60 * 15;

export const generateMagicLinkToken = () => {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	const token = encodeBase64url(bytes);
	return token;
};

export const hashToken = (token: string) => {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
};

export const sendMagicLinkEmail = async (email: string, token: string) => {
	const magicLinkUrl = `http://localhost:5173/auth/login?token=${token}`;

	const { data, error } = await sendEmail(
		[email],
		'Welcome to Tasken',
		`<a href="${magicLinkUrl}">Login</a>`
	);

	if (error) {
		throw new Error('Failed to send email: ' + error.message);
	}

	return data;
};

export const storeMagicLink = async (email: string, token: string) => {
	const tokenHash = hashToken(token);
	const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MS);

	const verification: table.Verification = {
		id: UUIDV4(),
		email,
		type: VerificationType.MAGIC_LINK,
		status: VerificationStatus.PENDING,
		token_hash: tokenHash,
		created_at: new Date(),
		expires_at: expiresAt,
		used_at: null
	};

	await db.insert(table.verification).values(verification);
	return verification;
};

export const isValidMagicLinkToken = async (token: string) => {
	const tokenHash = hashToken(token);

	const [verification] = await db
		.select()
		.from(table.verification)
		.where(eq(table.verification.token_hash, tokenHash));

	if (!verification) {
		return false;
	}

	if (verification.status !== VerificationStatus.PENDING) {
		return false;
	}

	if (verification.expires_at.getTime() < Date.now()) {
		await invalidateMagicLinkToken(token, VerificationStatus.EXPIRED);
		return false;
	}

	await invalidateMagicLinkToken(token, VerificationStatus.USED);
	return true;
};

const invalidateMagicLinkToken = async (
	token: string,
	status: Exclude<VerificationStatus, VerificationStatus.PENDING>
) => {
	const tokenHash = hashToken(token);

	const updateStatus =
		status === VerificationStatus.USED ? { used_at: new Date(), status } : { status };

	await db
		.update(table.verification)
		.set(updateStatus)
		.where(eq(table.verification.token_hash, tokenHash));
};
