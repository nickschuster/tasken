import { Google, GitHub, Apple } from 'arctic';
import { env } from '$env/dynamic/private';

const GOOGLE_REDIRECT_URI = `${env.BASE_URL}/api/auth/google/callback`;
const APPLE_REDIRECT_URI = `${env.BASE_URL}/api/auth/apple/callback`;

export const googleOAuth = new Google(
  env.GOOGLE_OAUTH_CLIENT_ID!,
  env.GOOGLE_OAUTH_CLIENT_SECRET!,
  GOOGLE_REDIRECT_URI
);

export const githubOAuth = new GitHub(env.GITHUB_OAUTH_CLIENT_ID!, env.GITHUB_OAUTH_CLIENT_SECRET!, null);

// export const appleOAuth = new Apple({
// 	clientId: process.env.APPLE_OAUTH_CLIENT_ID!,
// 	teamId: process.env.APPLE_OAUTH_TEAM_ID!,
// 	keyId: process.env.APPLE_OAUTH_KEY_ID!,
// 	privateKey: process.env.APPLE_OAUTH_PRIVATE_KEY!.replace(/\\n/g, '\n'),
// 	redirectUri: process.env.APPLE_OAUTH_REDIRECT_URI!,
// 	scopes: ['name', 'email']
// });
