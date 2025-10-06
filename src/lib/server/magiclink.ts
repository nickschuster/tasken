import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';

const MAGIC_LINK_EXPIRY_MS = 1000 * 60 * 15; // 15 minutes

export const generateMagicLinkToken = (): string => {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	const token = encodeBase64url(bytes);
	return token;
};

export const hashToken = (token: string): string => {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
};

export const sendMagicLinkEmail = async (email: string, token: string) => {
	const magicLinkUrl = `http://localhost:5173/auth/login?token=${token}`;
	// TODO: call email service
	throw new Error('Email service not implemented');
};

export const storeMagicLink = (email: string, token: string) => {
	// TODO: store magic link in database
};

export const isValidMagicLinkToken = (token: string): boolean => {
	// TODO: verify user exists, token exists, not expired, not used
	return true;
};

export const invalidateMagicLink = (token: string) => {
	// TODO: invalidate magic link in database
};
