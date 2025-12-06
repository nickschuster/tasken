import { Google, GitHub, Apple } from 'arctic';
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, BASE_URL } from '$env/static/private';

const GOOGLE_REDIRECT_URI = `${BASE_URL}/api/auth/google/callback`;
const GITHUB_REDIRECT_URI = `${BASE_URL}/api/auth/github/callback`;
const APPLE_REDIRECT_URI = `${BASE_URL}/api/auth/apple/callback`;

export const googleOAuth = new Google(
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI
);

// export const githubOAuth = new Github({
// 	clientId: GITHUB_OAUTH_CLIENT_ID!,
// 	clientSecret: GITHUB_OAUTH_CLIENT_SECRET!,
// 	redirectUri: GITHUB_OAUTH_REDIRECT_URI!,
// 	scopes: ['read:user', 'user:email']
// });

// export const appleOAuth = new Apple({
// 	clientId: process.env.APPLE_OAUTH_CLIENT_ID!,
// 	teamId: process.env.APPLE_OAUTH_TEAM_ID!,
// 	keyId: process.env.APPLE_OAUTH_KEY_ID!,
// 	privateKey: process.env.APPLE_OAUTH_PRIVATE_KEY!.replace(/\\n/g, '\n'),
// 	redirectUri: process.env.APPLE_OAUTH_REDIRECT_URI!,
// 	scopes: ['name', 'email']
// });
